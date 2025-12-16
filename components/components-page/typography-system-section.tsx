import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import {
  typographyTokens,
  type TypographySize,
  type TypographyTone,
  type TypographyVariant
} from "@/lib/tokens/typography";

const variantShowcase: Array<{
  id: TypographyVariant;
  label: string;
  helper: string;
  sample: string;
}> = [
  { id: "display", label: "Display", helper: "히어로 · 랜딩 헤더", sample: "애플리케이션 메시지를 강조하는 디스플레이 타입" },
  { id: "headline", label: "Headline", helper: "섹션 타이틀", sample: "섹션 진입점을 명확히 보여줍니다." },
  { id: "title", label: "Title", helper: "카드 타이틀", sample: "콘텐츠 블록 이름을 표시합니다." },
  { id: "subtitle", label: "Subtitle", helper: "요약 설명", sample: "본문보다 약간 작은 톤으로 설명합니다." },
  { id: "body", label: "Body", helper: "기본 본문", sample: "일반 텍스트 정보 영역에 사용합니다." },
  { id: "bodySmall", label: "Body Small", helper: "보조 본문", sample: "상세 설명, 툴팁 등에 적합합니다." },
  { id: "caption", label: "Caption", helper: "라벨 · 배지", sample: "상태 설명이나 메타 정보에 사용합니다." },
  { id: "mono", label: "Monospace", helper: "데이터 · 코드", sample: "숫자나 코드를 정렬감 있게 제공합니다." },
  { id: "overline", label: "Overline", helper: "섹션 카테고리", sample: "섹션 상단 보조 라벨입니다." }
];

const sizeScale = Object.entries(typographyTokens.sizes).map(([id, scale]) => ({
  id: id as TypographySize,
  ...scale
}));

const tonePalette = Object.entries(typographyTokens.tones).map(([id, tone]) => ({
  id: id as TypographyTone,
  ...tone
}));

const fontStacks = [
  {
    id: "sans",
    label: "Sans",
    usage: "UI 전체 기본 서체",
    stack: typographyTokens.fonts.sans
  },
  {
    id: "mono",
    label: "Monospace",
    usage: "코드, 수치 데이터",
    stack: typographyTokens.fonts.mono
  }
];

export function TypographySystemSection() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <Text variant="overline" className="text-slate-400">
          Typography System
        </Text>
        <Text asChild variant="headline" className="block text-slate-50">
          텍스트 토큰 & 프리셋
        </Text>
        <Text variant="subtitle" className="text-slate-300">
          폰트, 크기, 톤, 굵기를 토큰으로 정리해 일관된 타이포그래피 경험을 제공합니다.
        </Text>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Variant Preview</CardTitle>
            <Text variant="bodySmall" className="text-slate-400">
              화면 계층에 맞춰 사전 정의된 프리셋을 재사용할 수 있습니다.
            </Text>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {variantShowcase.map((variant) => (
              <div
                key={variant.id}
                className="rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <Text variant="caption">{variant.label}</Text>
                  <Text variant="bodySmall" className="text-slate-500">
                    {variant.helper}
                  </Text>
                </div>
                <Text variant={variant.id} className="mt-2 block text-slate-50">
                  {variant.sample}
                </Text>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Size Scale · Leading</CardTitle>
            <Text variant="bodySmall" className="text-slate-400">
              모듈러 스케일과 line-height, letter-spacing을 함께 관리합니다.
            </Text>
          </CardHeader>
          <CardContent className="space-y-3">
            {sizeScale.map((size) => (
              <div
                key={size.id}
                className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <Text variant="caption">{size.id}</Text>
                  <Text variant="bodySmall" className="text-slate-500">
                    {size.fontSize} / {size.lineHeight}
                  </Text>
                </div>
                <Text
                  variant="body"
                  style={{
                    fontSize: size.fontSize,
                    lineHeight: size.lineHeight,
                    letterSpacing: size.letterSpacing
                  }}
                  className="block text-slate-100"
                >
                  본문 예시 텍스트가 스케일 규칙을 따릅니다.
                </Text>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tone & Contrast</CardTitle>
            <Text variant="bodySmall" className="text-slate-400">
              상태별 컬러 토큰을 텍스트에도 재사용합니다.
            </Text>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {tonePalette.map((tone) => (
              <div
                key={tone.id}
                className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <Text variant="caption">{tone.id}</Text>
                  <span
                    aria-hidden
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: tone.color }}
                  />
                </div>
                <Text tone={tone.id} className="text-base">
                  토큰 컬러를 사용한 텍스트
                </Text>
                <Text variant="bodySmall" className="text-slate-500">
                  Hover: {tone.hoverColor}
                </Text>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fonts & Weights</CardTitle>
            <Text variant="bodySmall" className="text-slate-400">
              서체 스택과 무게를 규칙으로 정의해 사용합니다.
            </Text>
          </CardHeader>
          <CardContent className="space-y-3">
            {fontStacks.map((font) => (
              <div
                key={font.id}
                className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <Text variant="caption">{font.label}</Text>
                  <Text variant="bodySmall" className="text-slate-500">
                    {font.usage}
                  </Text>
                </div>
                <Text
                  variant="body"
                  style={{ fontFamily: font.stack }}
                  className="text-base text-slate-100"
                >
                  가독성과 일관성을 위한 폰트 스택
                </Text>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(typographyTokens.weights).map(([weightName, value]) => (
                    <Text
                      key={`${font.id}-${weightName}`}
                      variant="bodySmall"
                      style={{ fontWeight: value }}
                      className="rounded-md bg-slate-900/50 px-2 py-1 text-slate-200 shadow-sm"
                    >
                      {weightName} · {value}
                    </Text>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
