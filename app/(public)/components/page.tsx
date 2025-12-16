import { TypographySystemSection } from "@/components/components-page/typography-system-section";
import {
  Button,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant
} from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colorTokens } from "@/lib/tokens/colors";

type PaletteGroup = {
  id: ButtonColor;
  label: string;
  description: string;
  swatches: Array<{ label: string; token: string; value: string }>;
};

const buttonTokens = colorTokens.buttons;

const paletteMeta: Record<ButtonColor, { label: string; description: string }> = {
  primary: { label: "Primary", description: "주요 CTA와 브랜드 포인트에 사용합니다." },
  secondary: { label: "Secondary", description: "중립적인 보조 액션과 UI 블록에 사용합니다." },
  info: { label: "Info", description: "정보성 알림이나 상태 배지를 표현합니다." },
  warning: { label: "Warning", description: "경고성 텍스트나 주의 버튼에 사용합니다." },
  error: { label: "Error", description: "위험 동작과 오류 배지를 강조합니다." }
};

const semanticPalette: PaletteGroup[] = (
  Object.entries(paletteMeta) as Array<[ButtonColor, { label: string; description: string }]>
).map(([id, meta]) => ({
  id,
  label: meta.label,
  description: meta.description,
  swatches: [
    {
      label: "Solid Background",
      token: `buttons.${id}.solid.background`,
      value: buttonTokens[id].solid.background
    },
    {
      label: "Outlined Border",
      token: `buttons.${id}.outlined.border`,
      value: buttonTokens[id].outlined.border
    },
    {
      label: "Soft Background",
      token: `buttons.${id}.soft.background`,
      value: buttonTokens[id].soft.background
    },
    { label: "Soft Text", token: `buttons.${id}.soft.text`, value: buttonTokens[id].soft.text }
  ]
}));

const buttonColorOptions = (
  Object.entries(paletteMeta) as Array<[ButtonColor, { label: string; description: string }]>
).map(([id, meta]) => ({ id, label: meta.label, description: meta.description }));

const buttonVariantShowcase: Array<{ id: ButtonVariant; label: string; helper: string }> = [
  { id: "solid", label: "Solid", helper: "가장 강조가 필요한 CTA" },
  { id: "outlined", label: "Outlined", helper: "보조 액션 혹은 세컨더리 CTA" },
  { id: "soft", label: "Soft", helper: "콘텐츠 내 포함되는 부드러운 강조" },
  { id: "text", label: "Text", helper: "링크 또는 최소한의 강조" }
];

const sizeShowcase: Array<{ id: ButtonSize; label: string; helper: string }> = [
  { id: "sm", label: "Small", helper: "폼 내부 보조 버튼" },
  { id: "md", label: "Medium", helper: "기본 값" },
  { id: "lg", label: "Large", helper: "주요 CTA" }
];

export default function ComponentLibraryPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 text-slate-100">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-slate-400">Design System · Preview</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-50">컴포넌트 라이브러리</h1>
        <p className="text-base text-slate-300">
          colors.json에 정의된 상태 색상을 한 화면에서 확인하고 버튼 토큰과 맞춰볼 수 있습니다.
        </p>
      </header>
      <section className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300">버튼 시스템</p>
          <p className="text-sm text-slate-500">
            5가지 색상과 solid / outlined / soft / text 유형을 조합해 다양한 상태를 표현할 수
            있습니다.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>색상 · 타입 매트릭스</CardTitle>
              <p className="text-sm text-slate-400">
                동일한 컴포넌트 API로 색상과 타입을 조합할 수 있습니다.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {buttonVariantShowcase.map((variant) => (
                <div key={variant.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-100">{variant.label}</span>
                    <span className="text-xs text-slate-500">{variant.helper}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {buttonColorOptions.map((color) => (
                      <Button
                        key={`${variant.id}-${color.id}`}
                        variant={variant.id}
                        color={color.id}
                      >
                        {color.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Size Scale</CardTitle>
              <p className="text-sm text-slate-400">
                Small / Medium / Large 세 가지 규격으로 구성했습니다.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {sizeShowcase.map((size) => (
                <div
                  key={size.id}
                  className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">{size.label}</span>
                    <span className="text-xs text-slate-500">{size.helper}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size={size.id} color="primary">
                      기본 버튼
                    </Button>
                    <Button size={size.id} variant="outlined" color="info">
                      Info Outlined
                    </Button>
                    <Button size={size.id} variant="soft" color="warning">
                      Warning Soft
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
      <TypographySystemSection />
    </section>
  );
}
