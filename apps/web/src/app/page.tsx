import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CalendarCheck2,
  KeyRound,
  MapPinned,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { routes } from "@/config/routes";

export default function HomePage() {
  return (
    <PublicLayout>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="hero-badge">
                <BadgeCheck size={17} />
                An toàn · Linh hoạt · Minh bạch
              </span>
              <h1>
                Thêm không gian.
                <br />
                <em>Nhẹ mọi lo toan.</em>
              </h1>
              <p>
                Kho lưu trữ tự phục vụ cho đồ cá nhân, hồ sơ và hàng kinh doanh. Chọn kích thước,
                đặt chỗ và quản lý hoàn toàn trực tuyến.
              </p>
              <div className="hero-actions">
                <Link className="button button-primary button-lg" href={routes.facilities}>
                  Tìm kho gần bạn <ArrowRight size={19} />
                </Link>
                <a className="button button-outline button-lg" href="#how-it-works">
                  Xem cách hoạt động
                </a>
              </div>
              <div className="hero-trust">
                <span>
                  <ShieldCheck />
                  Camera 24/7
                </span>
                <span>
                  <KeyRound />
                  Quyền truy cập riêng
                </span>
                <span>
                  <CalendarCheck2 />
                  Không gian linh hoạt
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="warehouse-scene">
                <div className="scene-top">
                  <span>storeX</span>
                  <small>SELF STORAGE</small>
                </div>
                <div className="storage-doors">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <span key={item}>
                      <i>{String(item).padStart(2, "0")}</i>
                    </span>
                  ))}
                </div>
                <div className="scene-card">
                  <Warehouse />
                  <div>
                    <strong>24 unit</strong>
                    <small>sẵn sàng hôm nay</small>
                  </div>
                </div>
              </div>
              <div className="floating-stat">
                <strong>4.9/5</strong>
                <span>Trải nghiệm khách hàng</span>
              </div>
            </div>
          </div>
        </section>
        <section className="proof-strip">
          <div className="container">
            <span>
              <strong>3</strong>Cơ sở tại Việt Nam
            </span>
            <span>
              <strong>24/7</strong>Camera giám sát
            </span>
            <span>
              <strong>100%</strong>Giá thuê minh bạch
            </span>
            <span>
              <strong>5 phút</strong>Để hoàn tất đặt chỗ
            </span>
          </div>
        </section>
        <section className="section" id="how-it-works">
          <div className="container">
            <div className="section-heading centered">
              <div>
                <span className="eyebrow">Quy trình đơn giản</span>
                <h2>Có kho phù hợp chỉ trong 3 bước</h2>
                <p>Từ tìm kiếm đến xác nhận, mọi thông tin đều rõ ràng.</p>
              </div>
            </div>
            <div className="process-grid">
              <article>
                <span>01</span>
                <MapPinned />
                <h3>Chọn cơ sở</h3>
                <p>Tìm địa điểm thuận tiện và kiểm tra số lượng kho còn trống.</p>
              </article>
              <article>
                <span>02</span>
                <Boxes />
                <h3>Chọn không gian</h3>
                <p>So sánh loại kho, kích thước và giá thuê phù hợp nhu cầu.</p>
              </article>
              <article>
                <span>03</span>
                <CalendarCheck2 />
                <h3>Đặt chỗ an tâm</h3>
                <p>Chọn thời gian, xem báo giá và thanh toán tiền cọc an toàn.</p>
              </article>
            </div>
          </div>
        </section>
        <section className="section feature-section">
          <div className="container feature-grid">
            <div className="feature-art">
              <div className="mini-unit">
                <Warehouse size={80} />
                <span>HCM-01</span>
              </div>
            </div>
            <div>
              <span className="eyebrow">Được thiết kế cho sự an tâm</span>
              <h2>Không chỉ là một chỗ để đồ</h2>
              <p>
                Mỗi cơ sở storeX được vận hành theo quy trình rõ ràng, từ kiểm tra kho đến quản lý
                quyền truy cập.
              </p>
              <ul className="check-list">
                <li>
                  <ShieldCheck />
                  Giám sát và bảo vệ tại cơ sở
                </li>
                <li>
                  <KeyRound />
                  Khóa hoặc mã truy cập riêng
                </li>
                <li>
                  <CalendarCheck2 />
                  Theo dõi reservation trực tuyến
                </li>
                <li>
                  <BadgeCheck />
                  Tình trạng kho được kiểm tra định kỳ
                </li>
              </ul>
              <Link className="text-link" href={routes.facilities}>
                Khám phá các cơ sở <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
        <section className="cta-section">
          <div className="container">
            <div>
              <span className="eyebrow light">Sẵn sàng bắt đầu?</span>
              <h2>Tìm không gian phù hợp ngay hôm nay.</h2>
              <p>Giá từ 750.000 ₫/tháng. Không có chi phí ẩn trong MVP.</p>
            </div>
            <Link className="button button-light button-lg" href={routes.facilities}>
              Xem kho còn trống <ArrowRight />
            </Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
