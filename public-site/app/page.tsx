import App from "../src/App";

export default function Page() {
  return <>
    <aside className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 border-b border-amber-200">
      公開示範版：使用示範資料、內建品質規則與報告範本。操作資料於重新整理後重置。
    </aside>
    <App />
  </>;
}
