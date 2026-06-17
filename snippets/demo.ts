// 外部ファイルのコードをスライドに取り込むデモ用スニペット。
// slides.md から `<<< @/snippets/demo.ts` で読み込める。
export function greet(name: string): string {
  return `Hello, ${name}!`
}

export const numbers = [1, 2, 3, 4, 5]
export const total = numbers.reduce((a, b) => a + b, 0)
