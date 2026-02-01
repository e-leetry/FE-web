import {
  findColumnByIdOrJob,
  reorderJobsInColumn,
  moveJobBetweenColumns,
  isSameDropPosition,
  findJobIndexInColumn,
  type Column,
  type Job
} from "@/lib/utils/kanban-utils";

const createMockJob = (id: number, companyName: string): Job => ({
  id,
  companyName,
  type: "default"
});

const createMockColumns = (): Column[] => [
  {
    id: 1,
    title: "관심공고",
    jobs: [createMockJob(1, "회사A"), createMockJob(2, "회사B"), createMockJob(3, "회사C")]
  },
  {
    id: 2,
    title: "서류제출",
    jobs: [createMockJob(4, "회사D")]
  },
  {
    id: 3,
    title: "면접",
    jobs: []
  }
];

describe("findColumnByIdOrJob", () => {
  const columns = createMockColumns();

  it("컬럼 ID로 컬럼을 찾을 수 있다", () => {
    const result = findColumnByIdOrJob(columns, 1);
    expect(result?.id).toBe(1);
    expect(result?.title).toBe("관심공고");
  });

  it("Job ID로 해당 Job이 속한 컬럼을 찾을 수 있다", () => {
    const result = findColumnByIdOrJob(columns, 2);
    expect(result?.id).toBe(1);
  });

  it("존재하지 않는 ID로 찾으면 undefined를 반환한다", () => {
    const result = findColumnByIdOrJob(columns, 999);
    expect(result).toBeUndefined();
  });

  it("존재하지 않는 Job ID로 찾으면 undefined를 반환한다", () => {
    const result = findColumnByIdOrJob(columns, 9999);
    expect(result).toBeUndefined();
  });
});

describe("reorderJobsInColumn", () => {
  it("같은 컬럼 내에서 Job 순서를 변경할 수 있다 (앞으로 이동)", () => {
    const columns = createMockColumns();
    // Job 3(인덱스 2)을 Job 1(인덱스 0) 위치로 이동 → [3, 1, 2]
    const result = reorderJobsInColumn(columns, 1, 3, 1, { isColumnDrop: false });

    const interestColumn = result.find((col) => col.id === 1);
    expect(interestColumn?.jobs.map((j) => j.id)).toEqual([3, 1, 2]);
  });

  it("같은 컬럼 내에서 Job 순서를 변경할 수 있다 (뒤로 이동)", () => {
    const columns = createMockColumns();
    const result = reorderJobsInColumn(columns, 1, 1, 3, { insertAfter: true });

    const interestColumn = result.find((col) => col.id === 1);
    expect(interestColumn?.jobs.map((j) => j.id)).toEqual([2, 3, 1]);
  });

  it("overId가 컬럼 ID면 맨 끝으로 이동한다", () => {
    const columns = createMockColumns();
    const result = reorderJobsInColumn(columns, 1, 1, 1, { isColumnDrop: true });

    const interestColumn = result.find((col) => col.id === 1);
    // Job 1은 이미 첫 번째이고 overId도 1(컬럼ID와 같음)이면 맨 끝으로 이동
    expect(interestColumn?.jobs.map((j) => j.id)).toEqual([2, 3, 1]);
  });

  it("같은 위치로 이동하면 변경 없이 반환한다", () => {
    const columns = createMockColumns();
    // Job 2를 Job 2 위치로 이동 (같은 위치)
    const result = reorderJobsInColumn(columns, 1, 2, 2);

    expect(result).toEqual(columns);
  });

  it("존재하지 않는 컬럼이면 변경 없이 반환한다", () => {
    const columns = createMockColumns();
    const result = reorderJobsInColumn(columns, 999, 1, 2);

    expect(result).toEqual(columns);
  });

  it("다른 컬럼은 영향받지 않는다", () => {
    const columns = createMockColumns();
    const result = reorderJobsInColumn(columns, 1, 1, 3, { insertAfter: true });

    const appliedColumn = result.find((col) => col.id === 2);
    expect(appliedColumn?.jobs.map((j) => j.id)).toEqual([4]);
  });

  it("overId 아래 영역에 드롭하면 그 Job 뒤에 추가 된다", () => {
    const columns = createMockColumns();
    const result = reorderJobsInColumn(columns, 1, 2, 3, { insertAfter: true });

    const interestColumn = result.find((col) => col.id === 1);
    expect(interestColumn?.jobs.map((j) => j.id)).toEqual([1, 3, 2]);
  });
});

describe("moveJobBetweenColumns", () => {
  it("Job을 다른 컬럼으로 이동할 수 있다", () => {
    const columns = createMockColumns();
    const result = moveJobBetweenColumns(columns, 1, 2, 2, 4);

    const interestColumn = result.find((col) => col.id === 1);
    const appliedColumn = result.find((col) => col.id === 2);

    expect(interestColumn?.jobs.map((j) => j.id)).toEqual([1, 3]);
    expect(appliedColumn?.jobs.map((j) => j.id)).toEqual([2, 4]);
  });

  it("빈 컬럼으로 Job을 이동할 수 있다", () => {
    const columns = createMockColumns();
    const result = moveJobBetweenColumns(columns, 1, 3, 1, 3);

    const interestColumn = result.find((col) => col.id === 1);
    const interviewColumn = result.find((col) => col.id === 3);

    expect(interestColumn?.jobs.map((j) => j.id)).toEqual([2, 3]);
    expect(interviewColumn?.jobs.map((j) => j.id)).toEqual([1]);
  });

  it("overId가 컬럼 ID면 맨 끝에 추가한다", () => {
    const columns = createMockColumns();
    const result = moveJobBetweenColumns(columns, 1, 2, 1, 2, { isColumnDrop: true });

    const appliedColumn = result.find((col) => col.id === 2);
    expect(appliedColumn?.jobs.map((j) => j.id)).toEqual([4, 1]);
  });

  it("다른 컬럼에 드롭할 때 아래 영역이면 해당 Job 뒤에 추가한다", () => {
    const columns = createMockColumns();
    const result = moveJobBetweenColumns(columns, 1, 2, 1, 4, { insertAfter: true });

    const appliedColumn = result.find((col) => col.id === 2);
    expect(appliedColumn?.jobs.map((j) => j.id)).toEqual([4, 1]);
  });

  it("존재하지 않는 컬럼이면 변경 없이 반환한다", () => {
    const columns = createMockColumns();
    const result = moveJobBetweenColumns(columns, 999, 2, 1, 4);

    expect(result).toEqual(columns);
  });

  it("존재하지 않는 Job이면 변경 없이 반환한다", () => {
    const columns = createMockColumns();
    const result = moveJobBetweenColumns(columns, 1, 2, 999, 4);

    expect(result).toEqual(columns);
  });
});

describe("isSameDropPosition", () => {
  it("같은 컬럼, 같은 인덱스면 true를 반환한다", () => {
    expect(isSameDropPosition(1, 1, 0, 0)).toBe(true);
    expect(isSameDropPosition(2, 2, 2, 2)).toBe(true);
  });

  it("다른 컬럼이면 false를 반환한다", () => {
    expect(isSameDropPosition(1, 2, 0, 0)).toBe(false);
  });

  it("같은 컬럼이지만 다른 인덱스면 false를 반환한다", () => {
    expect(isSameDropPosition(1, 1, 0, 1)).toBe(false);
  });

  it("originalColumnId가 null이면 false를 반환한다", () => {
    expect(isSameDropPosition(null, 1, 0, 0)).toBe(false);
  });

  it("originalIndex가 null이면 false를 반환한다", () => {
    expect(isSameDropPosition(1, 1, null, 0)).toBe(false);
  });
});

describe("findJobIndexInColumn", () => {
  const columns = createMockColumns();
  const interestColumn = columns[0];

  it("Job의 인덱스를 찾을 수 있다", () => {
    expect(findJobIndexInColumn(interestColumn, 1)).toBe(0);
    expect(findJobIndexInColumn(interestColumn, 2)).toBe(1);
    expect(findJobIndexInColumn(interestColumn, 3)).toBe(2);
  });

  it("존재하지 않는 Job이면 -1을 반환한다", () => {
    expect(findJobIndexInColumn(interestColumn, 999)).toBe(-1);
  });

  it("빈 컬럼에서 찾으면 -1을 반환한다", () => {
    const emptyColumn = columns[2];
    expect(findJobIndexInColumn(emptyColumn, 1)).toBe(-1);
  });
});
