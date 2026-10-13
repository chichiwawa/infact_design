/**
 * Accent — 제목 문자열의 **구절** 을 시그니처 블루로 강조 (실측: 두 레퍼런스 모두 제목 안 한 구절만 액센트 색).
 * 줄바꿈(\n)은 <br>로.
 */
export default function Accent({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\*\*([^*]+)\*\*$/);
        const content = (m ? m[1] : p).split("\n");
        const nodes = content.flatMap((line, j) => (j === 0 ? [line] : [<br key={`br${i}-${j}`} />, line]));
        return m ? <span key={i} className="accent">{nodes}</span> : <span key={i}>{nodes}</span>;
      })}
    </>
  );
}
