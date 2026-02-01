import { act } from "react-test-renderer";
import TestRenderer from "react-test-renderer";

import { Toast } from "@/components/ui/toast";

describe("Toast", () => {
  it("재렌더 중에도 정해진 시간에 한 번만 닫힌다", () => {
    vi.useFakeTimers();

    const firstClose = vi.fn();
    const secondClose = vi.fn();

    let renderer: TestRenderer.ReactTestRenderer;

    act(() => {
      renderer = TestRenderer.create(
        <Toast visible variant="success" onClose={firstClose} leftElement="알림" />
      );
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      renderer.update(<Toast visible variant="success" onClose={secondClose} leftElement="알림" />);
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(firstClose).not.toHaveBeenCalled();
    expect(secondClose).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(secondClose).toHaveBeenCalledTimes(1);

    act(() => {
      renderer.unmount();
    });
    vi.useRealTimers();
  });
});
