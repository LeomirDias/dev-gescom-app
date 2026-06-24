"use client"

import { useParams } from "next/navigation"
import { useCallback } from "react"
import { z } from "zod"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import {
  MemberDetailHeader,
  MemberLinkCard,
  MemberUserInfoCard,
} from "@/app/(app_routes)/members/[memberId]/_components/member-field"
import { UserOnboardingPanel } from "@/app/(app_routes)/profile/_components/onboarding/user-onboarding-panel"
import { MemberDepartmentsSection } from "@/app/(app_routes)/members/[memberId]/_components/member-departments-section"
import { RouteBreadcrumb } from "@/components/global/navigation/route-breadcrumb"
import { PermissionRouteGuard } from "@/components/global/guards/permission-route-guard"
import {
  ListErrorCard,
  PaginatedListLayout,
  StaleDataBanner,
  useListErrorState,
} from "@/components/global/listing/paginated-list-shell"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions, PERMISSION_CODES } from "@/lib/permissions"
import { useMemberQuery } from "@/modules/memberships/use-members"
import { buildEmptyUserDetails } from "@/modules/users-onboarding/users-onboarding-empty"
import { useUserDetailsQuery } from "@/modules/users-onboarding/use-users-onboarding"
import { AnimatedLoading } from "@/components/global/loading/animated-loading"

const memberIdSchema = z.uuid()

export function MemberDetailPage({
}) {
  const params = useParams()
  const rawId = typeof params["memberId"] === "string" ? params["memberId"] : ""
  const idResult = memberIdSchema.safeParse(rawId)
  const memberId = idResult.success ? idResult.data : null

  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const { data, error, isPending, isFetching, refetch } = useMemberQuery({
    enterpriseId,
    memberId: memberId ?? undefined,
    enabled: ready && perms.canConsultMembers && Boolean(memberId),
  })

  const userId = data?.user.id

  const {
    data: detailsData,
    error: detailsError,
    isPending: detailsPending,
    isFetching: detailsFetching,
    refetch: refetchDetails,
  } = useUserDetailsQuery({
    enterpriseId,
    userId,
    enabled: ready && perms.canConsultUsers && Boolean(userId),
  })

  const onboardingDetails =
    detailsData ?? (data ? buildEmptyUserDetails(data.user) : undefined)

  const { errMessage, errMeta } = useListErrorState(
    error,
    "Não foi possível carregar o membro."
  )

  const {
    errMessage: detailsErrMessage,
    errMeta: detailsErrMeta,
  } = useListErrorState(
    detailsError,
    "Não foi possível carregar o onboarding."
  )

  const isRefreshing = isFetching || detailsFetching

  const handleRefresh = useCallback(() => {
    void refetch()
    if (perms.canConsultUsers && userId) {
      void refetchDetails()
    }
  }, [perms.canConsultUsers, refetch, refetchDetails, userId])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching: isRefreshing,
    disabled: isRefreshing,
    enabled:
      ready &&
      perms.isReady &&
      !perms.isError &&
      perms.canConsultMembers &&
      Boolean(memberId),
  })

  if (!ready) {
    return (
      <PaginatedListLayout isReady={false}>
        <AnimatedLoading />
      </PaginatedListLayout>
    )
  }

  if (!memberId) {
    return (
      <PaginatedListLayout>
        <RouteBreadcrumb />
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Membro inválido</CardTitle>
            <CardDescription>Identificador UUID inválido.</CardDescription>
          </CardHeader>
        </Card>
      </PaginatedListLayout>
    )
  }

  const displayName = data?.user.userName.trim() || undefined

  return (
    <PermissionRouteGuard
      check={(p) => p.canConsultMembers}
      permissionLabel={PERMISSION_CODES.consultarMembros}
      loading={
        <PaginatedListLayout>
          <AnimatedLoading />
        </PaginatedListLayout>
      }
    >
      <PaginatedListLayout>
        <RouteBreadcrumb currentLabel={displayName} />

        {isPending && <AnimatedLoading />}

        {Boolean(error) && data && (
          <StaleDataBanner
            title="Não foi possível atualizar os dados."
            message={errMessage}
          />
        )}

        {Boolean(detailsError) && detailsData && (
          <StaleDataBanner
            title="Não foi possível atualizar o onboarding."
            message={detailsErrMessage}
          />
        )}

        {error && !data && !isPending && (
          <ListErrorCard
            title="Erro ao carregar o membro"
            message={errMessage}
            meta={errMeta}
          />
        )}

        {data && !isPending && !enterpriseId && (
          <Card>
            <CardHeader>
              <CardTitle>Membro não encontrado</CardTitle>
              <CardDescription>
                Este vínculo não pertence à classe esperada.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {data && !isPending && enterpriseId && (
          <div className="space-y-6">
            <MemberDetailHeader member={data} />

            <div className="flex flex-col gap-6">
              <MemberUserInfoCard
                user={data.user}
                enterpriseId={enterpriseId}
                memberId={data.id}
                canEdit={perms.canAlterUsers}
                onUpdateSuccess={() => void refetch()}
              />
              <MemberLinkCard
                member={data}
                enterpriseId={enterpriseId}
                canEdit={perms.canAlterMembers}
                onUpdateSuccess={() => void refetch()}
              />
            </div>

            {perms.canConsultUsers ? (
              <>
                {detailsError && !detailsData && !detailsPending && (
                  <ListErrorCard
                    title="Erro ao carregar onboarding"
                    message={detailsErrMessage}
                    meta={detailsErrMeta}
                  />
                )}
                <UserOnboardingPanel
                  details={onboardingDetails}
                  enterpriseId={enterpriseId}
                  userId={data.user.id}
                  memberId={data.id}
                  canAlter={perms.canAlterUsers}
                  isLoading={detailsPending}
                />
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding</CardTitle>
                  <CardDescription>
                    Necessita da permissão consultar_usuarios para ver os dados de onboarding.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <MemberDepartmentsSection
              enterpriseId={enterpriseId}
              member={data}
              canAlter={perms.canAlterMembers}
              canAlterPermissions={perms.canAlterPermissions}
            />
          </div>
        )}
      </PaginatedListLayout>
    </PermissionRouteGuard>
  )
}
