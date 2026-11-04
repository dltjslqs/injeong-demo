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
      // past the first 40px the banner retracts and the bar keeps a hairline
      const shadow = () => {
        hd.classList.toggle("sh", window.scrollY > 10);
        hd.classList.toggle("rt", window.scrollY > 40);
      };
      shadow();
      on(window, "scroll", shadow, { passive: true });
    }

    // home hero: crossfade through the project photos, with numbered buttons and a pause
    const hv = root.querySelector<HTMLElement>(".hv");
    if (hv) {
      const pics = Array.from(hv.querySelectorAll<HTMLImageElement>(".hv-pic"));
      const nums = Array.from(hv.querySelectorAll<HTMLButtonElement>(".hv-nums button:not(.hv-pause)"));
      const pause = hv.querySelector<HTMLButtonElement>(".hv-pause");
      const cap = hv.querySelector<HTMLElement>(".hv-cap");
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let at = 0;
      let timer: number | undefined;
      const show = (i: number) => {
        at = (i + pics.length) % pics.length;
        pics.forEach((p, j) => p.classList.toggle("on", j === at));
        nums.forEach((b, j) => {
          b.classList.toggle("on", j === at);
          b.setAttribute("aria-pressed", String(j === at));
        });
        if (cap) cap.textContent = pics[at].dataset.cap ?? "";
      };
      const stop = () => {
        window.clearInterval(timer);
        timer = undefined;
        if (pause) {
          pause.textContent = "재생";
          pause.setAttribute("aria-label", "사진 넘기기 다시 시작");
        }
      };
      const play = () => {
        window.clearInterval(timer);
        timer = window.setInterval(() => show(at + 1), 6000);
        if (pause) {
          pause.textContent = "멈춤";
          pause.setAttribute("aria-label", "사진 넘기기 멈춤");
        }
      };
      nums.forEach((b, j) => on(b, "click", () => { show(j); stop(); }));
      if (pause) on(pause, "click", () => (timer === undefined ? play() : stop()));
      if (still) stop();
      else play();
      off.push(() => window.clearInterval(timer));
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
