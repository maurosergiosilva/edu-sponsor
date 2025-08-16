import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store";
import { useRouter } from "expo-router";
import { formatToBRL } from "@/helpers/format";

export const AvailableCourses = () => {
  const { courses } = useUserStore();
  const router = useRouter();

  const handleCourseDetails = (id: string) => {
    router.push({
      pathname: "/course-details",
      params: {
        id,
      },
    });
  };

  return (
    <View className="mt-4">
      <Text className="text-xl font-bold mb-4">Cursos Disponíveis</Text>

      {courses.map((course) => (
        <View key={course.id} className="bg-card gap-2 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold">{course.title}</Text>

          <Text className="text-muted-foreground">{course.description}</Text>

          <Text className="font-medium">
            Valor: {formatToBRL(course.price || 0)}
          </Text>

          <Text className="text-sm text-muted-foreground">
            Duração: {course.duration}
          </Text>

          <Button
            size="sm"
            variant="secondary"
            onPress={() => handleCourseDetails(course.id)}
          >
            <Text>Ver detalhes</Text>
          </Button>
        </View>
      ))}
    </View>
  );
};
