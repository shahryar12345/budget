#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.


FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
# COPY ["ABS.ADSIntegrator.csproj", "ABS.ADSIntegrator/"]
COPY . ./

RUN dotnet restore "ABS.ADSIntegrator.csproj"
RUN dotnet clean "ABS.ADSIntegrator.csproj" 
RUN dotnet build "ABS.ADSIntegrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ABS.ADSIntegrator.csproj" -c Release -o /app/publish

FROM build AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "ABS.ADSIntegrator.dll"]