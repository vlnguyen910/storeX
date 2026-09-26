# storeX database diagram — inventory additions for Reservation M1

The `facilities` table is the parent entity for public inventory browsing.

```mermaid
erDiagram
  facilities ||--o{ unit_types : offers
  unit_types ||--o{ storage_units : materializes
  facilities ||--o{ facility_operating_hours : schedules
  facilities ||--o{ reservation_drafts : receives
  unit_types ||--o{ reservation_drafts : selects
  unit_types ||--o{ capacity_allocations : allocates
  facilities ||--o{ facility_assignments : has
  users ||--o{ facility_assignments : receives

  facilities {
    uuid id PK
    varchar code UK
    varchar name
    text address
    text description
    boolean is_active
  }

  unit_types {
    uuid id PK
    uuid facility_id FK
    varchar code
    varchar name
    varchar size_label
    real size_sqm
    integer monthly_price
    boolean is_active
  }

  storage_units {
    uuid id PK
    uuid facility_id FK
    uuid unit_type_id FK
    varchar code UK
    storage_unit_status status
  }

  facility_operating_hours {
    uuid id PK
    uuid facility_id FK
    integer day_of_week
    time open_time
    time close_time
    varchar timezone
  }

  reservation_drafts {
    uuid id PK
    uuid facility_id FK
    uuid unit_type_id FK
    timestamptz check_in_at
    timestamptz rental_end_at
    integer duration_months
    varchar contact_name
    varchar contact_email
    varchar contact_phone
    reservation_draft_status status
    reservation_pricing_status pricing_status
  }

  capacity_allocations {
    uuid id PK
    uuid facility_id FK
    uuid unit_type_id FK
    uuid reference_id
    capacity_allocation_kind kind
    capacity_allocation_status status
    timestamptz starts_at
    timestamptz ends_at
  }
```

For public catalog queries, a facility is eligible when it is active and has at
least one `storage_units.status = AVAILABLE`. Unit type availability is grouped
by `unit_types.id` and counts only `AVAILABLE` units. Reservation, hold and
booking flows reference the Unit Type ID; a physical unit is assigned later by
operations and is never selected by the customer.

The M0 customer decision intentionally keeps the future business model separate
from authentication: `customers.user_id` is nullable, and Booking/Rental will
reference `customers.id`, not `users.id`. Those tables are introduced by their
own reservation/booking issues and are not created by the browse migration.
