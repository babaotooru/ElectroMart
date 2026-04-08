FROM maven:3.8.1-openjdk-17 AS builder

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8081

CMD ["java", "-jar", "app.jar"]
