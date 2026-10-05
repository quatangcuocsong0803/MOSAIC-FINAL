"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { getUserProfile } from "@/app/actions/profile";
import { AVATAR_UPDATED_EVENT } from "@/lib/avatar-events";
import UtilityBar from "./UtilityBar";
import DiscussionDropdown, { discussionLinks } from "./DiscussionDropdown";

function DefaultAvatarIcon() {
  return (
    <svg className="w-5 h-5 text-[#8B6B4A]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.5-1.632z" />
    </svg>
  );
}


const navItems = [
  { label: "Tests", href: "/test" },
  { label: "Discover", href: "/discover" },
  { label: "Discussion", href: "/discussion" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Statistics", href: "/statistics" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuRef.current?.focus(); }
    };
    const media = window.matchMedia("(min-width:1181px)");
    const onResize = () => { if (media.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    media.addEventListener("change", onResize);
    return () => { window.removeEventListener("keydown", onKey); media.removeEventListener("change", onResize); };
  }, [open]);
  const { isSignedIn } = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setAvatarUrl(null);
      return;
    }

    const loadAvatar = () => {
      getUserProfile().then((res) => {
        setAvatarUrl(res.success ? res.profile?.avatarUrl ?? null : null);
      });
    };

    // Nhận URL mới ngay lập tức khi trang khác upload xong avatar
    const onAvatarUpdated = (e: Event) => {
      const url = (e as CustomEvent<string | null>).detail;
      if (url !== undefined) setAvatarUrl(url);
      else loadAvatar();
    };

    loadAvatar();
    window.addEventListener(AVATAR_UPDATED_EVENT, onAvatarUpdated);
    return () => window.removeEventListener(AVATAR_UPDATED_EVENT, onAvatarUpdated);
  }, [isSignedIn, pathname]);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function goToSignIn(event: React.MouseEvent<HTMLAnchorElement>) {
    if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu();
    window.location.assign(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`);
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <UtilityBar />

      <header className={`${styles.header} ${pathname === "/" ? styles.headerHome : ""} bg-transparent border-b border-[#E2D4B7]/40`}>
      {pathname === "/" && (
        <div className={styles.homeMasthead} aria-hidden="true">
          <span>Personality in pieces.</span>
        </div>
      )}
      <nav
        className={styles.nav}
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className={styles.brand}
          onClick={closeMenu}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma-home/logo-combined.png"
            alt="MOSAIC Logo"
            className={styles.brandImage}
          />
        </Link>

        <div className={styles.desktopNav}>
          {navItems.map((item) => {
            const active = isActive(item.href);

            if (item.label === "Discussion") return <DiscussionDropdown key={item.href} active={active} />;

            if (item.label === "Tests") {
              return (
                <div
                  key={item.href}
                  className={styles.navItemWithDropdown}
                >
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                  >
                    <span>Tests</span>
                    <span
                      className={styles.dropdownChevron}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </Link>

                  <div className={styles.navDropdown}>
                    <div className={styles.navDropdownPanel}>
                      <Link
                        href="/test"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Tất cả bài test
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Chọn assessment phù hợp với bạn
                        </span>
                      </Link>

                      <div className={styles.navDropdownDivider} />

                      <Link
                        href="/test/mbti"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Cognitive Functions
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Traditional · 72 câu
                        </span>
                      </Link>

                      <Link
                        href="/test/cognitive-functions/ai"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Cognitive Functions
                        </span>
                        <span className={styles.navDropdownDescription}>
                          AI Adaptive
                        </span>
                      </Link>

                      <Link
                        href="/test/enneagram"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Enneagram
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Core type · Wing · Tritype
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            if (item.label === "Knowledge") {
              return (
                <div
                  key={item.href}
                  className={styles.navItemWithDropdown}
                >
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                  >
                    <span>Knowledge</span>
                    <span
                      className={styles.dropdownChevron}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </Link>

                  <div className={styles.navDropdown}>
                    <div className={styles.navDropdownPanel}>
                      <Link
                        href="/knowledge"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Knowledge Hub
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Khám phá toàn bộ thư viện MOSAIC
                        </span>
                      </Link>

                      <div className={styles.navDropdownDivider} />

                      <Link
                        href="/knowledge/theory"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Cơ sở lý thuyết
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Nền tảng và cách MOSAIC tiếp cận typology
                        </span>
                      </Link>

                      <Link
                        href="/knowledge/cognitive/overview"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Cognitive Functions
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Ni · Ne · Ti · Te · Fi · Fe · Si · Se
                        </span>
                      </Link>

                      <Link
                        href="/knowledge/mbti/overview"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          MBTI
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Tổng quan 16 personality types
                        </span>
                      </Link>

                      <Link
                        href="/knowledge/enneagram/overview"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Enneagram
                        </span>
                        <span className={styles.navDropdownDescription}>
                          9 types · Wings · Tritype
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            if (item.label === "Statistics") {
              return (
                <div
                  key={item.href}
                  className={styles.navItemWithDropdown}
                >
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                  >
                    <span>Statistics</span>
                    <span
                      className={styles.dropdownChevron}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </Link>

                  <div className={styles.navDropdown}>
                    <div className={styles.navDropdownPanel}>
                      <Link
                        href="/statistics"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Tổng quan Statistics
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Số liệu cộng đồng MOSAIC
                        </span>
                      </Link>

                      <div className={styles.navDropdownDivider} />

                      <Link
                        href="/statistics#mbti"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Phân bổ MBTI
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Tỷ lệ 16 nhóm tính cách
                        </span>
                      </Link>

                      <Link
                        href="/statistics#enneagram"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Phân bổ Enneagram
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Tỷ lệ 9 Enneagram types
                        </span>
                      </Link>

                      <Link
                        href="/statistics#age"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Phân bổ độ tuổi
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Demographics theo nhóm tuổi
                        </span>
                      </Link>

                      <Link
                        href="/statistics#zodiac"
                        className={styles.navDropdownLink}
                      >
                        <span className={styles.navDropdownTitle}>
                          Cung hoàng đạo
                        </span>
                        <span className={styles.navDropdownDescription}>
                          Tương quan Zodiac · MBTI · Enneagram
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className={styles.desktopActions}>
          {!isSignedIn ? (
            <Link
              href={`/sign-in?redirect_url=${encodeURIComponent(pathname)}`} prefetch={false}
              className={styles.signIn}
              onClick={goToSignIn}
            >
              Sign in
            </Link>
          ) : (
            <div className="group relative flex items-center">
              <button
                type="button"
                className="flex items-center cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89B68]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EE]"
                aria-haspopup="menu"
                aria-label="Account menu"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-[#8B6B4A]/50 bg-[#FAF8F5] shrink-0 transition-all duration-200 group-hover:scale-105 group-hover:border-[#8B6B4A]/70 group-hover:shadow-md">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <DefaultAvatarIcon />
                  )}
                </div>
              </button>

              {/* Hover bridge + account dropdown */}
              <div
                className="
                  absolute right-0 top-full z-[200] w-56 pt-3
                  opacity-0 invisible pointer-events-none translate-y-1
                  transition-all duration-150
                  group-hover:opacity-100
                  group-hover:visible
                  group-hover:pointer-events-auto
                  group-hover:translate-y-0
                  group-focus-within:opacity-100
                  group-focus-within:visible
                  group-focus-within:pointer-events-auto
                  group-focus-within:translate-y-0
                "
              >
                <div
                  role="menu"
                  className="overflow-hidden rounded-xl border border-[#8B7355]/25 bg-[#FAF6F0]/95 shadow-xl backdrop-blur-md"
                >
                  <Link
                    href="/profile"
                    role="menuitem"
                    className="block px-4 py-3 transition-colors hover:bg-[#8B7355]/10 focus:bg-[#8B7355]/10 focus:outline-none"
                  >
                    <span className="block text-sm font-semibold text-[#5C4326]">
                      User Profile
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#9A8468]">
                      Profile và personality identity
                    </span>
                  </Link>

                  <div className="h-px bg-[#8B7355]/15" />

                  <Link href="/settings" role="menuitem" className="block px-4 py-3 text-sm font-semibold text-[#5C4326] hover:bg-[#8B7355]/10 focus:bg-[#8B7355]/10">Cài đặt</Link>

                  <div className="h-px bg-[#8B7355]/15" />

                  <SignOutButton>
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-[#8B7355] transition-colors hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 focus:text-rose-700 focus:outline-none cursor-pointer"
                    >
                      Sign out
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          ref={menuRef}
          aria-controls="mosaic-mobile-navigation"
          className={styles.menuButton}
          aria-label={
            open ? "Close navigation" : "Open navigation"
          }
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div
        id="mosaic-mobile-navigation"
        inert={!open}
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""
          }`}
      >
        <div className={styles.mobileNav}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            if (item.label === "Discussion") return <details key={item.href} className={styles.mobileDiscussion}>
              <summary className={styles.mobileLink}>Discussion ▾</summary>
              {discussionLinks.map(link => <Link key={link.href} href={link.href} className={styles.mobileDiscussionLink} onClick={closeMenu}>{link.title}</Link>)}
            </details>;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileLink} ${active
                  ? styles.mobileLinkActive
                  : ""
                  } flex items-center justify-between`}
                onClick={closeMenu}
              >
                <span className="relative inline-block">
                  {item.label}
                  {active && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src="/flower-branch-line-3.png" 
                      alt="Floral Line" 
                      className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-[140%] min-w-[60px] h-[16px] object-contain object-center pointer-events-none"
                      style={{ 
                        mixBlendMode: 'multiply', 
                        filter: 'sepia(30%) contrast(110%)',
                        opacity: 0.95
                      }} 
                    />
                  )}
                </span>
              </Link>
            );
          })}

          <div className={styles.mobileDivider} />

          {!isSignedIn ? (
            <Link
              href={`/sign-in?redirect_url=${encodeURIComponent(pathname)}`} prefetch={false}
              className={styles.mobileSignIn}
              onClick={goToSignIn}
            >
              Sign in
            </Link>
          ) : (
            <>
              <Link
                href="/profile"
                className={`${styles.mobileSignIn} flex items-center gap-3`}
                onClick={closeMenu}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-[#8B6B4A]/50 shrink-0 bg-[#FAF8F5]">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <DefaultAvatarIcon />
                  )}
                </span>
                <span>Thông tin người dùng</span>
              </Link>
              <Link href="/settings" className={styles.mobileSignIn} onClick={closeMenu}>Cài đặt</Link>
              <SignOutButton>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="mt-2 text-sm font-sans text-[#8B6B4A] hover:text-[#5C4326] transition-colors cursor-pointer text-left"
                >
                  Đăng xuất
                </button>
              </SignOutButton>
            </>
          )}
        </div>
      </div>
    </header>
    </>
  );
}
