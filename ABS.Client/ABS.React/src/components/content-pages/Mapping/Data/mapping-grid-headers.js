export const statisticsToDepartmentsHeaders = [
    {
     header: "Department",
     key: "department",
     extraDetails: [
      {
       key: "code",
       text: "Code",
       isHidden: false,
       showTooltipText: "Show Codes",
       hideTooltipText: "Hide Codes",
      },
      {
       key: "name",
       text: "Name",
       isHidden: false,
       showTooltipText: "Show Names",
       hideTooltipText: "Hide Names",
      },
     ],
    },
    {
     header: "Department description",
     key: "description",
     type: "other",
    },
    {
     header: "Primary statistics (optional)",
     key: "primaryStatistics",
     type: "statistics",
    },
    {
     header: "Secondary statistics (optional)",
     key: "secondaryStatistics",
     type: "statistics",
    },
    {
     header: "Tertiary statistics (optional)",
     key: "tertiaryStatistics",
     type: "statistics",
    },
   ];