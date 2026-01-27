"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { JobCard } from "@/components/dashboard/job-card";

const cardVariants = [
  {
    type: "default" as const,
    size: "M" as const,
    label: "Default / M",
    description: "기본 카드 (144px) - 직무명, 회사명, 마감일 표시"
  },
  {
    type: "default" as const,
    size: "S" as const,
    label: "Default / S",
    description: "작은 카드 - 직무명, 회사명만 표시 (마감일 숨김)"
  },
  {
    type: "loading" as const,
    size: "M" as const,
    label: "Loading / M",
    description: "로딩 카드 (144px) - 회사명 + AI 아이콘 + '불러오는 중'"
  },
  {
    type: "loading" as const,
    size: "S" as const,
    label: "Loading / S",
    description: "작은 로딩 카드 (80px)"
  }
];

const addCardVariants = [
  {
    size: "M" as const,
    label: "Add / M",
    description: "채용공고 추가 카드 (144px)"
  },
  {
    size: "S" as const,
    label: "Add / S",
    description: "작은 채용공고 추가 카드 (80px)"
  }
];

export function JobCardSection() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <Text variant="overline" tone="muted">
          Dashboard Components
        </Text>
        <Text asChild variant="headline" className="block">
          JobCard 컴포넌트
        </Text>
        <Text variant="bodySmall" tone="subtle" className="mt-2">
          대시보드에서 사용되는 채용공고 카드 컴포넌트입니다. type과 size props로 4가지 형태를 제어할 수
          있습니다.
        </Text>
      </div>

      {/* 메인 카드 타입들 */}
      <Card>
        <CardHeader>
          <CardTitle>Card Variants</CardTitle>
          <Text variant="bodySmall" tone="subtle">
            type: &quot;default&quot; | &quot;loading&quot; / size: &quot;M&quot; | &quot;S&quot;
          </Text>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            {cardVariants.map((variant) => (
              <div
                key={`${variant.type}-${variant.size}`}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex items-center justify-between">
                  <Text variant="title" className="font-semibold">
                    {variant.label}
                  </Text>
                  <Text variant="caption" tone="muted">
                    type=&quot;{variant.type}&quot; size=&quot;{variant.size}&quot;
                  </Text>
                </div>
                <Text variant="bodySmall" tone="subtle">
                  {variant.description}
                </Text>
                <div className="flex justify-center rounded-lg bg-[#F6F7F9] p-6">
                  <JobCard
                    id={variant.type === "loading" ? undefined : 1}
                    type={variant.type}
                    size={variant.size}
                    companyName="와드(캐치테이블)"
                    title="Product Designer"
                    deadline="25. 10. 19"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add 카드 타입 */}
      <Card>
        <CardHeader>
          <CardTitle>Add Card Variants</CardTitle>
          <Text variant="bodySmall" tone="subtle">
            type: &quot;add&quot; / size: &quot;M&quot; | &quot;S&quot;
          </Text>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            {addCardVariants.map((variant) => (
              <div
                key={`add-${variant.size}`}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex items-center justify-between">
                  <Text variant="title" className="font-semibold">
                    {variant.label}
                  </Text>
                  <Text variant="caption" tone="muted">
                    type=&quot;add&quot; size=&quot;{variant.size}&quot;
                  </Text>
                </div>
                <Text variant="bodySmall" tone="subtle">
                  {variant.description}
                </Text>
                <div className="flex justify-center rounded-lg bg-[#F6F7F9] p-6">
                  <JobCard type="add" size={variant.size} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Props 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>Props</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 font-semibold">Prop</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Default</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-mono text-purple-600">type</td>
                  <td className="px-4 py-3 font-mono text-slate-600">
                    &quot;default&quot; | &quot;loading&quot; | &quot;add&quot;
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500">&quot;default&quot;</td>
                  <td className="px-4 py-3 text-slate-600">카드 유형</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-purple-600">size</td>
                  <td className="px-4 py-3 font-mono text-slate-600">&quot;M&quot; | &quot;S&quot;</td>
                  <td className="px-4 py-3 font-mono text-slate-500">&quot;M&quot;</td>
                  <td className="px-4 py-3 text-slate-600">카드 크기 (M: 144px, S: 80px)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-purple-600">companyName</td>
                  <td className="px-4 py-3 font-mono text-slate-600">string</td>
                  <td className="px-4 py-3 font-mono text-slate-500">-</td>
                  <td className="px-4 py-3 text-slate-600">회사명</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-purple-600">title</td>
                  <td className="px-4 py-3 font-mono text-slate-600">string</td>
                  <td className="px-4 py-3 font-mono text-slate-500">-</td>
                  <td className="px-4 py-3 text-slate-600">직무명</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-purple-600">deadline</td>
                  <td className="px-4 py-3 font-mono text-slate-600">string</td>
                  <td className="px-4 py-3 font-mono text-slate-500">-</td>
                  <td className="px-4 py-3 text-slate-600">마감일 (size=&quot;M&quot;일 때만 표시)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-purple-600">onClick</td>
                  <td className="px-4 py-3 font-mono text-slate-600">() =&gt; void</td>
                  <td className="px-4 py-3 font-mono text-slate-500">-</td>
                  <td className="px-4 py-3 text-slate-600">클릭 이벤트 핸들러</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
