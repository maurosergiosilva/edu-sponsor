import { View, Pressable } from "react-native";
import { useUserStore } from "@/store";
import { Progress } from "@/components/ui/progress";
import { formatToBRL, formatPhone } from "@/helpers/format";
import {
  User,
  ChevronRight,
  BookOpen,
  Award,
  CreditCard,
  Heart,
  Trophy,
} from "@/lib/icons";
import { InternalTemplate } from "@/components/templates";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BADGES } from "@/helpers/constant";
import { Text } from "../ui/text";

export const Profile = () => {
  const { currentUser, users, courses, sponsorLevels } = useUserStore();
  const sponsor = users.find((user) => user.userType === "sponsor");

  const calculateCourseProgress = () => Math.floor(Math.random() * 101);

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-destructive";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const interestedCourses = currentUser?.interests?.length
    ? courses.filter(
        (course) =>
          currentUser.interests?.includes(course.id) &&
          !currentUser.sponsoredCourses?.some((sc) => sc.courseId === course.id)
      )
    : [];

  const currentSponsorLevel = sponsorLevels.find(
    ({ level }) => level === currentUser?.sponsorLevel
  );
  const nextSponsorLevel = sponsorLevels.find(
    ({ level }) => level === (currentUser?.sponsorLevel || 0) + 1
  );

  const sponsorProgress =
    nextSponsorLevel && currentUser
      ? Math.min(
          ((currentUser.sponsorPoints || 0) / nextSponsorLevel.pointsRequired) *
            100,
          100
        )
      : 100;

  return (
    <InternalTemplate
      title="Meu Perfil"
      description="Gerencie suas informações pessoais"
    >
      <Card className="mb-4">
        <CardHeader className="items-center pb-4">
          <Avatar
            className="w-20 h-20 mb-4 bg-accent items-center justify-center"
            alt="Avatar"
          >
            <User className="text-primary" size={32} />
          </Avatar>
          <Text className="text-2xl font-bold">{currentUser?.fullName}</Text>
          <Text className="text-muted-foreground">{currentUser?.email}</Text>
        </CardHeader>

        <CardContent className="gap-4">
          {currentUser?.phone && (
            <View className="flex-row items-center justify-between py-3 border-b border-border">
              <Text className="text-sm text-muted-foreground">Telefone</Text>
              <Text className="text-foreground">
                {formatPhone(currentUser.phone)}
              </Text>
            </View>
          )}

          {currentUser?.userType === "sponsor" && (
            <>
              <View className="flex-row items-center justify-between py-3 border-b border-border">
                <Text className="text-sm text-muted-foreground">Tipo</Text>
                <Text className="text-foreground">
                  {currentUser.sponsorType === "PF"
                    ? "Pessoa Física"
                    : "Pessoa Jurídica"}
                </Text>
              </View>

              {currentUser.companyName && (
                <View className="flex-row items-center justify-between py-3 border-b border-border">
                  <Text className="text-sm text-muted-foreground">Empresa</Text>
                  <Text className="text-foreground">
                    {currentUser.companyName}
                  </Text>
                </View>
              )}
            </>
          )}

          {currentUser?.userType === "student" && currentUser?.age && (
            <View className="flex-row items-center justify-between py-3 border-b border-border">
              <Text className="text-sm text-muted-foreground">Idade</Text>
              <Text className="text-foreground">{currentUser.age} anos</Text>
            </View>
          )}
        </CardContent>
      </Card>

      {currentUser?.userType === "sponsor" && (
        <>
          <Card className="mb-4">
            <CardHeader className="flex-row items-center justify-between pb-4">
              <Text className="text-xl font-bold">
                Seu Progresso como Patrocinador
              </Text>
              <Trophy className="text-primary" size={20} />
            </CardHeader>

            <CardContent className="gap-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-medium">Nível Atual</Text>
                <Text className="text-primary font-bold">
                  {currentSponsorLevel?.name || "Iniciante"}
                </Text>
              </View>

              <View className="mb-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-muted-foreground">Pontos</Text>
                  <Text className="text-sm font-medium">
                    {currentUser.sponsorPoints || 0} /{" "}
                    {nextSponsorLevel?.pointsRequired || "Max"}
                  </Text>
                </View>
                <Progress value={sponsorProgress} className="h-2" />
              </View>

              <View className="gap-2">
                <Text className="font-medium">Benefícios do Nível:</Text>
                {currentSponsorLevel?.benefits?.map((benefit, i) => (
                  <View key={i} className="flex-row items-center">
                    <Text>• {benefit}</Text>
                  </View>
                ))}
              </View>

              <View className="mt-6 p-4 bg-primary/10 rounded-lg">
                <Text className="font-bold text-lg mb-2">
                  Sorteio de Patrocinadores
                </Text>
                <Text className="mb-3">
                  Participe do sorteio semanal! O prêmio atual é de{" "}
                  {formatToBRL(
                    useUserStore.getState().sponsorLottery.prizePool
                  )}
                  .
                </Text>
                <Button
                  size="sm"
                  onPress={() =>
                    useUserStore.getState().enterSponsorLottery(currentUser.id)
                  }
                  disabled={(currentUser.sponsorPoints || 0) < 50}
                >
                  <Text>Participar (custa 50 pontos)</Text>
                </Button>
              </View>
            </CardContent>
          </Card>

          {(currentUser?.badges?.length || 0) > 0 && (
            <Card className="mb-4">
              <CardHeader className="flex-row items-center justify-between pb-4">
                <Text className="text-xl font-bold">Minhas Conquistas</Text>
                <Award className="text-primary" size={20} />
              </CardHeader>
              <CardContent className="flex-row flex-wrap gap-2">
                {(currentUser.badges || []).map((badgeId) => {
                  const badge = BADGES.find(({ id }) => id === badgeId);
                  return (
                    badge && (
                      <View
                        key={badge.id}
                        className="bg-secondary p-3 rounded-lg items-center w-[48%]"
                      >
                        <Text className="text-2xl">{badge.icon}</Text>
                        <Text className="font-medium text-center">
                          {badge.name}
                        </Text>
                        <Text className="text-xs text-muted-foreground text-center">
                          {badge.description}
                        </Text>
                      </View>
                    )
                  );
                })}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {currentUser?.userType === "sponsor" &&
        (currentUser?.sponsorships?.length ?? 0) > 0 && (
          <Card className="mb-4">
            <CardHeader className="flex-row items-center justify-between pb-4">
              <Text className="text-xl font-bold">Progresso dos Cursos</Text>
              <Award className="text-primary" size={20} />
            </CardHeader>
            <CardContent className="gap-6">
              {(currentUser.sponsorships ?? []).map(
                ({ id, courseTitle, amount, studentName }) => {
                  const progress = calculateCourseProgress();
                  return (
                    <Pressable key={id}>
                      <View className="mb-2">
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="font-medium text-foreground">
                            {courseTitle}
                          </Text>
                          <Text className="text-primary font-medium">
                            {formatToBRL(amount)}
                          </Text>
                        </View>
                        <Text className="text-sm text-muted-foreground mb-3">
                          Aluno: {studentName || "Anônimo"}
                        </Text>
                        <View className="gap-2">
                          <View className="flex-row justify-between">
                            <Text className="text-sm text-muted-foreground">
                              Progresso
                            </Text>
                            <Text className="text-sm font-medium text-foreground">
                              {progress}%
                            </Text>
                          </View>
                          <View className="w-full bg-secondary rounded-full h-2">
                            <View
                              className={`h-2 rounded-full ${getProgressColor(
                                progress
                              )}`}
                              style={{ width: `${progress}%` }}
                            />
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  );
                }
              )}
            </CardContent>
          </Card>
        )}

      {(currentUser?.sponsoredCourses?.length ?? 0) > 0 && (
        <Card className="mb-4">
          <CardHeader className="flex-row items-center justify-between pb-4">
            <Text className="text-xl font-bold">Meus Cursos Patrocinados</Text>
            <BookOpen className="text-primary" size={20} />
          </CardHeader>
          <CardContent className="gap-4">
            {(currentUser?.sponsoredCourses ?? []).map(
              ({ id, courseTitle, amount }) => (
                <Pressable
                  key={id}
                  className="flex-row items-center justify-between py-3 border-b border-border"
                >
                  <View>
                    <Text className="font-medium text-foreground">
                      {courseTitle}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Patrocinado por:{" "}
                      {sponsor?.fullName || sponsor?.companyName || "Anônimo"}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-primary mr-2">
                      {formatToBRL(amount)}
                    </Text>
                    <ChevronRight className="text-muted-foreground" size={16} />
                  </View>
                </Pressable>
              )
            )}
          </CardContent>
        </Card>
      )}

      {interestedCourses.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="flex-row items-center justify-between pb-4">
            <Text className="text-xl font-bold">Meus Interesses</Text>
            <Heart className="text-primary" size={20} />
          </CardHeader>
          <CardContent className="gap-4">
            {interestedCourses.map(({ id, title, category, price }) => (
              <Pressable key={id} className="py-3 border-b border-border">
                <View>
                  <Text className="font-medium text-foreground">{title}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {category} • {formatToBRL(price)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Pressable className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-row items-center">
              <CreditCard className="text-primary mr-3" size={20} />
              <Text className="text-foreground">Métodos de Pagamento</Text>
            </View>
            <ChevronRight className="text-muted-foreground" size={16} />
          </Pressable>
          <View className="h-px w-fit bg-border mx-6" />
          <Pressable className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-row items-center">
              <User className="text-primary mr-3" size={20} />
              <Text className="text-foreground">Editar Perfil</Text>
            </View>
            <ChevronRight className="text-muted-foreground" size={16} />
          </Pressable>
        </CardContent>
      </Card>
    </InternalTemplate>
  );
};

export default Profile;
