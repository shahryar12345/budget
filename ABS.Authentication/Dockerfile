#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 20250

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["AuthServer/AuthServer.csproj", "AuthServer/"]
RUN dotnet restore "AuthServer/AuthServer.csproj"
COPY . .
WORKDIR "/src/AuthServer"
RUN dotnet build "AuthServer.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AuthServer.csproj" -c Release -o /app/publish

FROM base AS final
ENV ASPNETCORE_URLS http://+:20250
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AuthServer.dll"]
