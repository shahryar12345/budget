#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["ABSOcelot/ABSOcelot.csproj", "ABSOcelot/"]
RUN dotnet restore "ABSOcelot/ABSOcelot.csproj"
COPY . .
WORKDIR "/src/ABSOcelot"
RUN dotnet build "ABSOcelot.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ABSOcelot.csproj" -c Release -o /app/publish

FROM build AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ABSOcelot.dll"]
EXPOSE 2020