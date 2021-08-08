FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build

WORKDIR /src

COPY . ./

RUN dotnet restore "./DBModels/ABS.DBModels/ABS.DBModels.csproj"
RUN dotnet restore "./Api/ABSDAL/ABSDAL.csproj"

WORKDIR "./DBModels/ABS.DBModels"

RUN dotnet clean "ABS.DBModels.csproj" 
RUN dotnet build "ABS.DBModels.csproj" -c Release -o /app/build

WORKDIR "../../Api/ABSDAL"

RUN dotnet clean "ABSDAL.csproj" 
RUN dotnet build "ABSDAL.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ABSDAL.csproj" -c Release -o /app/publish

FROM build AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ABSDAL.dll"]

EXPOSE 20201
