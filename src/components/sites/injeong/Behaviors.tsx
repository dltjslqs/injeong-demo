"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Site-wide behavior, re-bound on every page: mobile menu, header shadow, works filter, inquiry form, reveal and count-up. */
export function Behaviors() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.getElementById("ij");
    if (!root) return;
    const off: Array<() => void> = [];
    const on = (t: Window | Document | Element, ev: string, fn: EventListener, opts?: AddEventListenerOptions) => {
      t.addEventListener(ev, fn, opts);
      off.push(() => t.removeEventListener(ev, fn, opts));
    };

    // header
    const hd = document.getElementById("ij-hd");
    const mb = hd?.querySelector<HTMLButtonElement>(".mb");
    if (hd && mb) {
      const setOpen = (open: boolean) => {
        hd.classList.toggle("open", open);
        mb.setAttribute("aria-expanded", String(open));
        mb.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      };
      setOpen(false);
      on(mb, "click", () => setOpen(!hd.classList.contains("open")));
      hd.querySelectorAll(".mnav a").forEach((a) => on(a, "click", () => setOpen(false)));
      const shadow = () => hd.classList.toggle("sh", window.scrollY > 10);
      shadow();
      on(window, "scroll", shadow, { passive: true });
    }

    // works filter
    const tabs = root.querySelectorAll<HTMLButtonElement>(".tabs button");
    const cards = root.querySelectorAll<HTMLElement>(".pf article");
    tabs.forEach((b) => {
      on(b, "click", () => {
        tabs.forEach((x) => {
          x.classList.toggle("on", x === b);
          x.setAttribute("aria-pressed", String(x === b));
        });
        const f = b.dataset.f;
        cards.forEach((c) => {
          c.hidden = f !== "전체" && c.dataset.cat !== f;
        });
      });
    });

    // inquiry form (posts to this app's own /api/inquiry only)
    const form = document.getElementById("ij-form") as HTMLFormElement | null;
    if (form) {
      const msg = form.querySelector<HTMLElement>(".msg");
      const btn = form.querySelector<HTMLButtonElement>("button[type=submit]");
      const fail = (text: string) => {
        if (msg) {
          msg.textContent = text;
          msg.className = "msg err";
        }
        if (btn) {
          btn.disabled = false;
          btn.textContent = "견적 상담 신청";
        }
      };
      on(form, "submit", (e) => {
        e.preventDefault();
        const d: Record<string, FormDataEntryValue | number> = {};
        new FormData(form).forEach((v, k) => {
          d[k] = v;
        });
        const agree = form.elements.namedItem("agree") as HTMLInputElement | null;
        d.agree = agree?.checked ? 1 : 0;
        if (!d.type || !d.name || !d.phone || !d.agree) {
          fail("필수 항목(공사 종류·성함·연락처)과 개인정보 동의를 확인해 주세요.");
          return;
        }
        if (process.env.NEXT_PUBLIC_STATIC_DEMO === "1") {
          // the GitHub Pages preview has no server, so nothing is sent
          form.innerHTML =
            '<div class="done"><b>데모 페이지라 신청이 전송되지 않습니다.</b><p>실제 상담은 대표전화 <a href="tel:041-633-9942">041-633-9942</a>로 문의해 주세요.</p></div>';
          return;
        }
        if (btn) {
          btn.disabled = true;
          btn.textContent = "전송하고 있습니다";
        }
        fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
          .then((res) => res.json().then((j: { message?: string }) => ({ ok: res.ok, j })))
          .then((x) => {
            if (x.ok) {
              form.innerHTML =
                '<div class="done"><b>신청이 정상적으로 전달되었습니다.</b><p>담당 엔지니어가 검토 후 영업일 기준 하루 안에 전화드립니다. 일정이 급하시면 대표전화 <a href="tel:041-633-9942">041-633-9942</a>를 이용해 주세요.</p></div>';
            } else fail(x.j?.message || "전송에 실패했습니다. 다시 한번 눌러 주세요.");
          })
          .catch(() => fail("연결이 원활하지 않습니다. 잠시 뒤 다시 보내 주세요."));
      });
    }

    if (!("IntersectionObserver" in window)) return () => off.forEach((fn) => fn());

    // reveal on scroll
    root.classList.add("js");
    const reveal = new IntersectionObserver(
      (es) => es.forEach((x) => {
        if (x.isIntersecting) {
          x.target.classList.add("vis");
          reveal.unobserve(x.target);
        }
      }),
      { threshold: 0.12 },
    );
    root.querySelectorAll(".rv").forEach((el) => reveal.observe(el));

    // count-up numbers
    const fmt = (v: number) => Math.round(v).toLocaleString("ko-KR");
    const run = (el: HTMLElement) => {
      const to = Number(el.dataset.to);
      let t0: number | null = null;
      const step = (t: number) => {
        if (t0 === null) t0 = t;
        const k = Math.min((t - t0) / 1600, 1);
        el.textContent = fmt(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const counters = root.querySelectorAll<HTMLElement>(".cnt");
    counters.forEach((el) => {
      el.textContent = "0";
    });
    const count = new IntersectionObserver(
      (es) => es.forEach((x) => {
        if (x.isIntersecting) {
          run(x.target as HTMLElement);
          count.unobserve(x.target);
        }
      }),
      { threshold: 0.5 },
    );
    counters.forEach((el) => count.observe(el));

    return () => {
      off.forEach((fn) => fn());
      reveal.disconnect();
      count.disconnect();
    };
  }, [pathname]);

  return null;
}
