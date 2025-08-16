import { Text } from "@/components/ui/text";
import { UserData, useUserStore } from "@/store";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Router, useRouter } from "expo-router";
import { GraduationCap, User, Plus } from "@/lib/icons";
import { InternalTemplate } from "@/components/templates";
import { AvailableCourses } from "../organisms";
import { formatToBRL } from "@/helpers/format";

interface DashboardDataProps {
  router: Router;
  currentUser: UserData | null;
}

export const Homepage = () => {
  const { currentUser } = useUserStore();
  const router = useRouter();

  return (
    <InternalTemplate
      title={`Bem-vindo, ${currentUser?.fullName?.split(" ")[0] || ""}`}
      description={
        currentUser?.userType === "student"
          ? "Encontre cursos para seu desenvolvimento"
          : "Gerencie seus patrocínios"
      }
    >
      {currentUser?.userType === "student" ? (
        <StudentDashboard router={router} currentUser={currentUser} />
      ) : (
        <SponsorDashboard router={router} currentUser={currentUser} />
      )}
    </InternalTemplate>
  );
};

const StudentDashboard = ({ router, currentUser }: DashboardDataProps) => (
  <View className="gap-4">
    {currentUser?.sponsoredCourses?.length ? (
      <View className="bg-primary/10 p-4 rounded-lg">
        <Text className="text-lg font-semibold mb-2">
          Meus Cursos Patrocinados
        </Text>
        {currentUser.sponsoredCourses.map((course: any) => (
          <View key={course.id} className="mb-3">
            <Text className="font-medium">{course.courseTitle}</Text>
            <Text className="text-muted-foreground text-sm">
              Patrocinado por: {course.studentName || "Anônimo"}
            </Text>
            <Text className="text-muted-foreground text-sm">
              Valor: {formatToBRL(course.amount)}
            </Text>
          </View>
        ))}
      </View>
    ) : (
      <View className="bg-primary/10 p-4 rounded-lg">
        <Text className="text-lg font-semibold mb-2">Meus Cursos</Text>
        <Text className="text-muted-foreground">
          Você ainda não tem cursos patrocinados
        </Text>
      </View>
    )}

    <AvailableCourses />

    <View className="flex-row gap-3">
      <Button
        size="lg"
        onPress={() => router.navigate("/profile")}
        variant="outline"
        className="w-full"
      >
        <User className="mr-2 text-foreground" />
        <Text>Perfil</Text>
      </Button>
    </View>
  </View>
);

const SponsorDashboard = ({ router, currentUser }: DashboardDataProps) => (
  <View className="gap-4">
    <View className="bg-primary/10 p-4 rounded-lg">
      <Text className="text-lg font-semibold mb-2">Seu Saldo</Text>
      <Text className="text-2xl font-bold">
        {formatToBRL(currentUser?.balance || 0)}
      </Text>
    </View>

    {currentUser?.sponsorships?.length ? (
      <View className="bg-primary/10 p-4 rounded-lg">
        <Text className="text-lg font-semibold mb-2">Seus Patrocínios</Text>
        {currentUser.sponsorships.map((sponsorship: any) => (
          <View key={sponsorship.id} className="mb-3">
            <Text className="font-medium">{sponsorship.courseTitle}</Text>
            <Text className="text-muted-foreground text-sm">
              Para: {sponsorship.studentName || "Anônimo"}
            </Text>
            <Text className="text-muted-foreground text-sm">
              Valor: {formatToBRL(sponsorship.amount)}
            </Text>
          </View>
        ))}
      </View>
    ) : (
      <View className="bg-primary/10 p-4 rounded-lg">
        <Text className="text-lg font-semibold mb-2">Seus Patrocínios</Text>
        <Text className="text-muted-foreground">
          Você ainda não patrocinou nenhum aluno
        </Text>
      </View>
    )}

    <AvailableCourses />

    <View className="flex-row gap-3">
      <Button
        size="lg"
        onPress={() => router.navigate("/add-funds")}
        className="flex-1"
      >
        <Plus className="mr-2 text-secondary" />
        <Text>Adicionar Fundos</Text>
      </Button>
      <Button
        size="lg"
        onPress={() => router.navigate("/profile")}
        variant="outline"
      >
        <User className="mr-2 text-foreground" />
        <Text>Perfil</Text>
      </Button>
    </View>
  </View>
);

export default Homepage;
