#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build

WORKDIR /src

COPY . ./

RUN dotnet restore "./DBModels/ABS.DBModels/ABS.DBModels.csproj"
RUN dotnet restore "./Processing/ABSProcessing/ABSProcessing.csproj"

WORKDIR "./DBModels/ABS.DBModels"

RUN dotnet clean "ABS.DBModels.csproj" 
RUN dotnet build "ABS.DBModels.csproj" -c Release -o /app/build

WORKDIR "/src/Processing/ABSProcessing"
RUN dotnet clean "ABSProcessing.csproj"
RUN dotnet build "ABSProcessing.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ABSProcessing.csproj" -c Release -o /app/publish

FROM build AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ABSProcessing.dll"]

EXPOSE 20203