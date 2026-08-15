import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import setPikLogo from "@/assets/icons/ic_setpik_logo.svg";
import "./footer.css";

const QUICK_LINKS = [
  { label: "서비스 소개", to: "/#service" },
  { label: "추천 공연", to: "/concerts" },
  { label: "개인정보처리방침", to: "/privacy" },
  { label: "이용약관", to: "/terms" },
];

export function Footer() {
  const { isAuthenticated, isOnboardingComplete } = useAuth();
  const logoPath = isAuthenticated && isOnboardingComplete ? "/concerts" : "/";

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__columns">
          <section className="site-footer__brand" aria-label="SetPik 소개">
            <Link className="site-footer__logo-link" to={logoPath} aria-label="SetPik 홈">
              <img className="site-footer__logo" src={setPikLogo} alt="" />
            </Link>
            <p className="site-footer__description">
              Spotify 플레이리스트 기반
              <br />
              AI 공연 추천 서비스
            </p>
          </section>

          <section className="site-footer__section" aria-labelledby="footer-team-title">
            <h2 id="footer-team-title">Team</h2>
            <dl className="site-footer__details">
              <div>
                <dt>팀원</dt>
                <dd>
                  표형원, 김은지, 김연재, 박지윤, 이주석,
                  <br />
                  강재진, 박정엽, 장민준, 김유정, 최영현
                </dd>
              </div>
              <div>
                <dt>이메일</dt>
                <dd>team@setpik.io</dd>
              </div>
              <div>
                <dt>과목</dt>
                <dd>2026 PTS</dd>
              </div>
            </dl>
          </section>

          <nav className="site-footer__section" aria-labelledby="footer-links-title">
            <h2 id="footer-links-title">Quick Links</h2>
            <ul className="site-footer__links">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 SetPik. All rights reserved.</p>
          <p>AI · Music · Concerts</p>
        </div>
      </div>
    </footer>
  );
}
