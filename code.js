function numberFrames() {
  const frames = figma.currentPage.selection.filter(node => node.type === "FRAME");
  if (!frames.length) return "请先选中需要编号的 Frame。";

  const entries = frames.map(node => ({ node, bounds: node.absoluteBoundingBox }));
  if (entries.some(entry => !entry.bounds)) {
    return "有 Frame 无法取得画布坐标。请选中画布上可见的 Frame 后重试。";
  }
  entries.sort((a, b) => a.bounds.y - b.bounds.y || a.bounds.x - b.bounds.x ||
    a.node.id.localeCompare(b.node.id));

  const changed = [];
  try {
    for (const [index, entry] of entries.entries()) {
      const name = String(index + 1);
      if (entry.node.name === name) continue;
      const original = entry.node.name;
      entry.node.name = name;
      changed.push({ node: entry.node, original });
    }
  } catch (error) {
    for (const entry of changed.reverse()) entry.node.name = entry.original;
    return "有 Frame 无法改名，已恢复原名。请检查所选 Frame 是否可编辑。";
  }
  return "已为 " + frames.length + " 个 Frame 顺序编号。";
}

figma.closePlugin(numberFrames());
