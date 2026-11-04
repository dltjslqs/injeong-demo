"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BASE } from "./base";
import { extOf, formatSize, MB, UPLOAD } from "./upload";

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
      // the logo on the page it points to goes back to the top instead of doing nothing
      const logo = hd.querySelector<HTMLAnchorElement>("a.logo");
      if (logo) {
        on(logo, "click", (e) => {
          const ev = e as MouseEvent;
          if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
          if (new URL(logo.href).pathname.replace(/\/$/, "") !== location.pathname.replace(/\/$/, "")) return;
          e.preventDefault();
          setOpen(false);
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        });
      }
      // past the first 40px the banner retracts and the bar keeps a hairline
      const shadow = () => {
        hd.classList.toggle("sh", window.scrollY > 10);
        hd.classList.toggle("rt", window.scrollY > 40);
      };
      shadow();
      on(window, "scroll", shadow, { passive: true });
    }

    // home hero: background footage with a pause button; still for reduced motion
    const vid = root.querySelector<HTMLVideoElement>(".hv-vid");
    const pause = root.querySelector<HTMLButtonElement>(".hv-pause");
    if (vid) {
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const label = () => {
        if (!pause) return;
        pause.textContent = vid.paused ? "재생" : "멈춤";
        pause.setAttribute("aria-label", vid.paused ? "배경 영상 재생" : "배경 영상 멈춤");
      };
      if (still) vid.pause();
      else vid.play().catch(() => {});
      on(vid, "play", label);
      on(vid, "pause", label);
      // reveal the footage once it is actually moving, over the poster frame
      const ready = () => vid.classList.add("on");
      if (vid.readyState >= 3) ready();
      on(vid, "playing", ready);
      // dip to dark across the loop seam so the jump back to the start never shows
      on(vid, "timeupdate", () => {
        const left = vid.duration - vid.currentTime;
        vid.classList.toggle("seam", left < 0.9 || vid.currentTime < 0.5);
      });
      if (pause) on(pause, "click", () => (vid.paused ? vid.play().catch(() => {}) : vid.pause()));
      label();
    }

    // plaques slider: arrows step one card, the count and the progress line follow the scroll
    const pqRow = root.querySelector<HTMLElement>(".pq-row");
    if (pqRow) {
      const wrap = pqRow.parentElement;
      const prev = root.querySelector<HTMLButtonElement>(".pq-btn.prev");
      const next = root.querySelector<HTMLButtonElement>(".pq-btn.next");
      const count = root.querySelector<HTMLElement>(".pq-count");
      const cards = Array.from(pqRow.children) as HTMLElement[];
      const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : pqRow.clientWidth);
      const sync = () => {
        const max = pqRow.scrollWidth - pqRow.clientWidth;
        const x = pqRow.scrollLeft;
        if (prev) prev.disabled = x <= 2;
        if (next) next.disabled = x >= max - 2;
        wrap?.classList.toggle("end", x >= max - 2);
        wrap?.classList.toggle("mid", x > 2);
        if (count) count.textContent = `${String(Math.round(x / step()) + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      };
      if (prev) on(prev, "click", () => pqRow.scrollBy({ left: -step(), behavior: "smooth" }));
      if (next) on(next, "click", () => pqRow.scrollBy({ left: step(), behavior: "smooth" }));
      // moves on its own every 3 seconds and wraps to the first card; holds still under the pointer,
      // while a card or arrow has focus, off screen, and for reduced motion
      const wrapEl = pqRow.closest(".trust") ?? pqRow;
      let held = false;
      let seen = false;
      const advance = () => {
        if (held || !seen || document.hidden) return;
        const max = pqRow.scrollWidth - pqRow.clientWidth;
        if (pqRow.scrollLeft >= max - 2) pqRow.scrollTo({ left: 0, behavior: "smooth" });
        else pqRow.scrollBy({ left: step(), behavior: "smooth" });
      };
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const tick = window.setInterval(advance, 3000);
        off.push(() => window.clearInterval(tick));
        on(wrapEl, "pointerenter", () => { held = true; });
        on(wrapEl, "pointerleave", () => { held = false; });
        on(wrapEl, "focusin", () => { held = true; });
        on(wrapEl, "focusout", () => { held = false; });
        const io = new IntersectionObserver((es) => { seen = es[0].isIntersecting; }, { threshold: 0.3 });
        io.observe(pqRow);
        off.push(() => io.disconnect());
      }
      on(pqRow, "scroll", sync, { passive: true });
      on(window, "resize", sync);
      sync();
    }

    // case photographs: cross-fade every 3.5 seconds; the dots pick one; holds still under the pointer,
    // off screen and for reduced motion (the first photograph shows without scripting)
    const cs = root.querySelector<HTMLElement>(".cs-stage");
    if (cs) {
      const slides = Array.from(cs.querySelectorAll<HTMLElement>(".cs"));
      const dots = Array.from(root.querySelectorAll<HTMLButtonElement>(".cs-dots button"));
      let i = 0;
      const show = (n: number) => {
        i = (n + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle("on", k === i));
        dots.forEach((d, k) => d.setAttribute("aria-current", k === i ? "true" : "false"));
      };
      dots.forEach((d, k) => on(d, "click", () => show(k)));
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && slides.length > 1) {
        let held = false;
        let seen = false;
        const box = cs.closest(".case-pic") ?? cs;
        on(box, "pointerenter", () => { held = true; });
        on(box, "pointerleave", () => { held = false; });
        const io = new IntersectionObserver((es) => { seen = es[0].isIntersecting; }, { threshold: 0.3 });
        io.observe(cs);
        off.push(() => io.disconnect());
        const tick = window.setInterval(() => { if (!held && seen && !document.hidden) show(i + 1); }, 3500);
        off.push(() => window.clearInterval(tick));
      }
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
      const btnLabel = btn?.textContent ?? "견적 문의 보내기";
      const say = (text: string, err = true) => {
        if (!msg) return;
        msg.textContent = text;
        msg.className = err ? "msg err" : "msg";
      };
      const fail = (text: string) => {
        say(text);
        if (btn) {
          btn.disabled = false;
          btn.textContent = btnLabel;
        }
      };

      // attachments: picked with the button or dropped onto the box
      const drop = form.querySelector<HTMLElement>(".drop");
      const picker = form.querySelector<HTMLInputElement>("input[type=file]");
      const list = form.querySelector<HTMLUListElement>(".files");
      let files: File[] = [];
      const render = () => {
        if (!list) return;
        list.innerHTML = "";
        files.forEach((f, i) => {
          const li = document.createElement("li");
          li.innerHTML = `<span class="fn"></span><span class="fs num">${formatSize(f.size)}</span><button type="button" aria-label="첨부 삭제">×</button>`;
          li.querySelector(".fn")!.textContent = f.name;
          li.querySelector("button")!.addEventListener("click", () => {
            files = files.filter((_, j) => j !== i);
            render();
          });
          list.appendChild(li);
        });
        const total = files.reduce((a, f) => a + f.size, 0);
        drop?.classList.toggle("has", files.length > 0);
        const sum = form.querySelector<HTMLElement>(".fsum");
        if (sum) sum.textContent = files.length ? `${files.length}개, ${formatSize(total)}` : "";
      };
      const add = (incoming: FileList | File[]) => {
        const rejected: string[] = [];
        for (const f of Array.from(incoming)) {
          if (!UPLOAD.exts.includes(extOf(f.name))) rejected.push(`${f.name}: 받을 수 없는 형식`);
          else if (f.size > UPLOAD.maxFileMB * MB) rejected.push(`${f.name}: 파일당 ${UPLOAD.maxFileMB}MB 초과`);
          else if (files.length >= UPLOAD.maxFiles) rejected.push(`${f.name}: 최대 ${UPLOAD.maxFiles}개`);
          else if (files.reduce((a, x) => a + x.size, 0) + f.size > UPLOAD.maxTotalMB * MB) rejected.push(`${f.name}: 합계 ${UPLOAD.maxTotalMB}MB 초과`);
          else if (!files.some((x) => x.name === f.name && x.size === f.size)) files.push(f);
        }
        render();
        if (rejected.length) say(`첨부하지 못한 파일이 있습니다. ${rejected.join(" / ")}`);
        else say("", false);
      };
      if (picker) {
        on(picker, "change", () => {
          if (picker.files) add(picker.files);
          picker.value = "";
        });
      }
      if (drop) {
        const stop = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        };
        for (const ev of ["dragenter", "dragover"]) on(drop, ev, (e) => { stop(e); drop.classList.add("over"); });
        for (const ev of ["dragleave", "dragend"]) on(drop, ev, (e) => { stop(e); drop.classList.remove("over"); });
        on(drop, "drop", (e) => {
          stop(e);
          drop.classList.remove("over");
          const dt = (e as DragEvent).dataTransfer;
          if (dt?.files.length) add(dt.files);
        });
      }

      on(form, "submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        fd.delete("files");
        const agree = form.elements.namedItem("agree") as HTMLInputElement | null;
        fd.set("agree", agree?.checked ? "1" : "0");
        if (!fd.get("type") || !fd.get("name") || !fd.get("phone") || fd.get("agree") !== "1") {
          fail("필수 항목(공사 종류·성함·연락처)과 개인정보 동의를 확인해 주세요.");
          return;
        }
        files.forEach((f) => fd.append("files", f, f.name));
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
        say("", false);
        // XMLHttpRequest (not fetch) so large drawings can show upload progress
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${BASE}/api/inquiry`);
        xhr.upload.onprogress = (p) => {
          if (btn && p.lengthComputable && files.length) btn.textContent = `파일 올리는 중 ${Math.round((p.loaded / p.total) * 100)}%`;
        };
        xhr.onload = () => {
          let j: { message?: string } = {};
          try {
            j = JSON.parse(xhr.responseText);
          } catch {}
          if (xhr.status >= 200 && xhr.status < 300) {
            form.innerHTML =
              '<div class="done"><b>신청이 정상적으로 전달되었습니다.</b><p>담당자가 내용과 첨부 자료를 검토한 뒤 영업일 기준 하루 안에 전화드립니다. 일정이 급하시면 대표전화 <a href="tel:041-633-9942">041-633-9942</a>를 이용해 주세요.</p></div>';
          } else fail(j.message || "전송에 실패했습니다. 다시 한번 눌러 주세요.");
        };
        xhr.onerror = () => fail("연결이 원활하지 않습니다. 잠시 뒤 다시 보내 주세요.");
        xhr.send(fd);
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
