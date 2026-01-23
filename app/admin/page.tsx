"use client";

import { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAllUsers,
  useDeleteUser,
  getGetAllUsersQueryKey
} from "@/lib/api/generated/admin-user/admin-user";
import type { UserResponse } from "@/lib/api/generated/model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const PROVIDER_LABELS: Record<string, string> = {
  GOOGLE: "Google",
  KAKAO: "카카오"
} as const;

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "관리자",
  USER: "일반 사용자"
} as const;

function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const { data: users = [], isLoading, error } = useGetAllUsers();

  const deleteUserMutation = useDeleteUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
        setDeletingUserId(null);
      },
      onError: () => {
        alert("회원 삭제에 실패했습니다.");
        setDeletingUserId(null);
      }
    }
  });

  const handleDeleteUser = (user: UserResponse) => {
    if (!user.id) return;

    const confirmed = window.confirm(
      `정말로 "${user.name}" 회원을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );

    if (confirmed) {
      setDeletingUserId(user.id);
      deleteUserMutation.mutate({ userId: user.id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">회원 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">회원 목록을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">회원 관리</h2>
          <p className="mt-1 text-sm text-gray-500">전체 회원 수: {users.length}명</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16">ID</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="w-24">가입 경로</TableHead>
              <TableHead className="w-24">권한</TableHead>
              <TableHead className="w-40">가입일</TableHead>
              <TableHead className="w-24 text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  등록된 회원이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.profileImageUrl && (
                        <Image
                          src={user.profileImageUrl}
                          alt={`${user.name} 프로필`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      )}
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {PROVIDER_LABELS[user.provider] ?? user.provider}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ROLE_LABELS[user.role] ?? user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      disabled={deletingUserId === user.id}
                    >
                      {deletingUserId === user.id ? "삭제 중..." : "삭제"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
