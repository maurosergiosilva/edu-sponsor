import { View, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store";
import { useRouter, useLocalSearchParams } from "expo-router";
import { InternalTemplate } from "@/components/templates";
import { formatToBRL } from "@/helpers/format";
import { BADGES } from "@/helpers/constant";

export const CourseDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentUser, courses, users, addSponsorship } = useUserStore();

  const course = courses.find((course) => course.id === id);

  if (!course) {
    return (
      <InternalTemplate title="Curso não encontrado">
        <View className="p-4">
          <Text>O curso solicitado não foi encontrado.</Text>
          <Button onPress={() => router.back()} className="mt-4">
            <Text>Voltar</Text>
          </Button>
        </View>
      </InternalTemplate>
    );
  }

  const handleAddInterest = () => {
    if (!currentUser) return;

    const updatedInterests = [...(currentUser.interests || []), course.id];
    useUserStore
      .getState()
      .updateUser(currentUser.id, { interests: updatedInterests });

    Alert.alert(
      "Interesse registrado",
      `Você demonstrou interesse no curso ${course.title}. Agora você aparece para patrocinadores.`
    );
  };

  const handleSponsorStudent = () => {
    if (!currentUser || currentUser.balance === undefined) return;

    if (currentUser.balance < course.price) {
      Alert.alert(
        "Saldo insuficiente",
        "Você não tem saldo suficiente para patrocinar este curso. Adicione mais fundos."
      );
      return;
    }

    const interestedStudents = users.filter(
      (user) =>
        user.userType === "student" &&
        user.interests?.includes(course.id) &&
        !user.sponsoredCourses?.some((sc) => sc.courseId === course.id)
    );

    if (interestedStudents.length === 0) {
      Alert.alert(
        "Nenhum estudante interessado",
        "No momento não há estudantes interessados neste curso."
      );
      return;
    }

    const randomIndex = Math.floor(Math.random() * interestedStudents.length);
    const selectedStudent = interestedStudents[randomIndex];

    const sponsorship = {
      id: Math.random().toString(),
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      courseId: course.id,
      courseTitle: course.title,
      amount: course.price,
      date: new Date().toISOString(),
    };

    addSponsorship(sponsorship);

    const newBadges = useUserStore.getState().checkForNewBadges(currentUser.id);

    if (newBadges.length > 0) {
      const badgeNames = BADGES.filter((badge) => newBadges.includes(badge.id))
        .map((badge) => `${badge.icon} ${badge.name}`)
        .join(", ");

      Alert.alert("Novas Conquistas!", `Você ganhou as badges: ${badgeNames}`);
    }

    Alert.alert(
      "Patrocínio realizado!",
      `Você patrocinou ${selectedStudent.fullName} para o curso ${course.title}.` +
        `\n\nVocê ganhou ${Math.floor(
          course.price / 10
        )} pontos de patrocinador!`
    );

    router.back();
  };

  return (
    <InternalTemplate title={course.title} description={course.category}>
      <View className="gap-4">
        <Text className="text-lg">{course.description}</Text>

        <View className="bg-primary/10 p-4 rounded-lg">
          <Text className="font-semibold">Detalhes do Curso</Text>
          <View className="mt-2 gap-1">
            <Text>Duração: {course.duration}</Text>
            <Text>Valor: {formatToBRL(course.price || 0)}</Text>
          </View>
        </View>

        {currentUser?.userType === "student" ? (
          <View className="gap-4 mt-6">
            <Text className="text-lg font-semibold">
              Demonstre interesse neste curso
            </Text>
            <Text className="text-muted-foreground">
              Ao demonstrar interesse, você aparecerá para patrocinadores que
              possam financiar seu curso.
            </Text>
            <Button
              size="lg"
              onPress={handleAddInterest}
              disabled={currentUser.interests?.includes(course.id)}
            >
              <Text>
                {currentUser.interests?.includes(course.id)
                  ? "Interesse já registrado"
                  : "Tenho interesse"}
              </Text>
            </Button>
          </View>
        ) : (
          <View className="gap-4 mt-6">
            <Text className="text-lg font-semibold">
              Patrocine um estudante
            </Text>
            <Text className="text-muted-foreground">
              Ao patrocinar, você será redirecionado para o pagamento e um
              estudante interessado será selecionado aleatoriamente.
            </Text>
            <View className="bg-card p-4 rounded-lg">
              <Text className="font-medium mb-2">Seu saldo disponível:</Text>
              <Text className="text-2xl font-bold">
                {formatToBRL(currentUser?.balance || 0) || "0,00"}
              </Text>
            </View>
            <Button
              size="lg"
              onPress={handleSponsorStudent}
              disabled={(currentUser?.balance || 0) < course.price}
            >
              <Text>Patrocinar por {formatToBRL(course.price)}</Text>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onPress={() => router.navigate("/add-funds")}
            >
              <Text>Adicionar fundos</Text>
            </Button>
          </View>
        )}
      </View>
    </InternalTemplate>
  );
};

export default CourseDetails;
