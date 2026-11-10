"use client";

import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { type Editor, EditorContent, mergeAttributes, Node, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { type DocNode, docToBlocks } from "@/lib/injeong/coldoc";
import { uploadPhoto } from "./actions";
import { shrinkImage } from "./shrink";

/** The contact box with the 견적 문의 button: one editable line, drawn as a box in the editor. */
const AskBox = Node.create({
  name: "askBox",
  group: "block",
  content: "text*",
  marks: "",
  defining: true,
  parseHTML: () => [{ tag: "div[data-ask]" }],
  renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-ask": "", class: "ed-ask" }), 0],
});

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** A toolbar button that keeps the editor's selection (mousedown would otherwise move focus). */
function Btn({ on, label, run, disabled }: { on?: boolean; label: string; run: () => void; disabled?: boolean }) {
  return (
    <button type="button" className={on ? "ed-b on" : "ed-b"} aria-pressed={on} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={run}>
      {label}
    </button>
  );
}

export function RichEditor({ initial }: { initial: DocNode }) {
  const hidden = useRef<HTMLInputElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // the paste/drop handlers are bound once, so they reach the editor through a ref
  const live = useRef<Editor | null>(null);

  const sync = (ed: Editor) => {
    if (hidden.current) hidden.current.value = JSON.stringify(docToBlocks(ed.getJSON() as DocNode));
  };

  const upload = async (ed: Editor, files: File[], at?: number) => {
    const imgs = files.filter((f) => IMAGE_TYPES.includes(f.type));
    if (!imgs.length) return false;
    setBusy(true);
    setError(null);
    for (const f of imgs) {
      const fd = new FormData();
      fd.set("photo", await shrinkImage(f));
      const res = await uploadPhoto(null, fd);
      if (res?.url) {
        // a photo is its own block: put it after the paragraph, list or table the cursor is in, never inside it
        const $pos = ed.state.doc.resolve(at ?? ed.state.selection.from);
        const after = $pos.depth >= 1 ? $pos.after(1) : $pos.pos;
        ed.chain().focus().insertContentAt(after, { type: "image", attrs: { src: res.url, alt: "" } }).run();
        at = undefined;
      } else if (res?.message) setError(res.message);
    }
    setBusy(false);
    return true;
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        italic: false,
        underline: false,
        link: false,
        horizontalRule: false,
      }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: "여기에 본문을 쓰세요. 워드나 한글에서 복사해 붙여넣어도 됩니다." }),
      AskBox,
    ],
    content: initial,
    editorProps: {
      attributes: { class: "ed-doc", "aria-label": "칼럼 본문" },
      handlePaste: (_view, e) => {
        const files = Array.from(e.clipboardData?.files ?? []);
        if (!files.some((f) => IMAGE_TYPES.includes(f.type)) || !live.current) return false;
        void upload(live.current, files);
        return true;
      },
      handleDrop: (view, e) => {
        const files = Array.from((e as DragEvent).dataTransfer?.files ?? []);
        if (!files.some((f) => IMAGE_TYPES.includes(f.type)) || !live.current) return false;
        const pos = view.posAtCoords({ left: e.clientX, top: e.clientY })?.pos;
        e.preventDefault();
        void upload(live.current, files, pos);
        return true;
      },
    },
    onCreate: ({ editor: ed }) => {
      live.current = ed;
      sync(ed);
    },
    onUpdate: ({ editor: ed }) => sync(ed),
  });

  const s = useEditorState({
    editor,
    selector: ({ editor: ed }) =>
      ed
        ? {
            p: ed.isActive("paragraph") && !ed.isActive("blockquote"),
            h2: ed.isActive("heading", { level: 2 }),
            h3: ed.isActive("heading", { level: 3 }),
            bold: ed.isActive("bold"),
            ul: ed.isActive("bulletList"),
            ol: ed.isActive("orderedList"),
            q: ed.isActive("blockquote"),
            table: ed.isActive("table"),
            img: ed.isActive("image"),
            undo: ed.can().undo(),
            redo: ed.can().redo(),
          }
        : null,
  });

  if (!editor) return <div className="ed"><div className="ed-loading">편집기 불러오는 중</div></div>;
  const st = s ?? { p: false, h2: false, h3: false, bold: false, ul: false, ol: false, q: false, table: false, img: false, undo: false, redo: false };
  const c = () => editor.chain().focus();

  return (
    <div className="ed">
      <input ref={hidden} type="hidden" name="blocks" />
      <div className="ed-bar" role="toolbar" aria-label="본문 서식">
        <div className="ed-grp">
          <Btn label="본문" on={st.p} run={() => c().setParagraph().run()} />
          <Btn label="소제목" on={st.h2} run={() => c().toggleHeading({ level: 2 }).run()} />
          <Btn label="작은 제목" on={st.h3} run={() => c().toggleHeading({ level: 3 }).run()} />
        </div>
        <div className="ed-grp">
          <Btn label="굵게" on={st.bold} run={() => c().toggleBold().run()} />
        </div>
        <div className="ed-grp">
          <Btn label="• 목록" on={st.ul} run={() => c().toggleBulletList().run()} />
          <Btn label="1. 목록" on={st.ol} run={() => c().toggleOrderedList().run()} />
          <Btn label="강조 질문" on={st.q} run={() => c().toggleBlockquote().run()} />
        </div>
        <div className="ed-grp">
          <Btn label="표 넣기" on={st.table} run={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
          <Btn label={busy ? "사진 올리는 중" : "사진"} disabled={busy} run={() => picker.current?.click()} />
          <Btn label="견적 문의 상자" run={() => c().insertContent({ type: "askBox", content: [{ type: "text", text: "공사 상담이 필요하다면," }] }).run()} />
        </div>
        <div className="ed-grp ed-end">
          <Btn label="실행 취소" disabled={!st.undo} run={() => c().undo().run()} />
          <Btn label="다시 실행" disabled={!st.redo} run={() => c().redo().run()} />
        </div>
        <input
          ref={picker}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          multiple
          hidden
          onChange={(e) => {
            void upload(editor, Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>
      {st.table && (
        <div className="ed-bar ed-sub" role="toolbar" aria-label="표 편집">
          <span>표</span>
          <Btn label="아래에 행 추가" run={() => c().addRowAfter().run()} />
          <Btn label="오른쪽에 열 추가" run={() => c().addColumnAfter().run()} />
          <Btn label="행 삭제" run={() => c().deleteRow().run()} />
          <Btn label="열 삭제" run={() => c().deleteColumn().run()} />
          <Btn label="표 삭제" run={() => c().deleteTable().run()} />
        </div>
      )}
      {st.img && (
        <div className="ed-bar ed-sub" role="toolbar" aria-label="사진 편집">
          <span>사진</span>
          <Btn
            label="설명 입력"
            run={() => {
              const cur = String(editor.getAttributes("image").alt ?? "");
              const v = window.prompt("사진 아래에 보일 설명", cur);
              if (v !== null) c().updateAttributes("image", { alt: v }).run();
            }}
          />
          <Btn label="사진 삭제" run={() => c().deleteSelection().run()} />
        </div>
      )}
      {error && <p className="ad-err" role="alert">{error}</p>}
      <EditorContent editor={editor} />
      <p className="ad-muted ad-small">사진은 끌어다 놓거나 붙여넣어도 올라갑니다. 「견적 문의 상자」 안의 문장 뒤에 「인정건설에 연락 주세요」와 버튼이 붙습니다.</p>
    </div>
  );
}
