const headers = [
  // {
  //   // `key` is the name of the field on the row object itself for the header
  //   key:'budgetVersionID',

  //   // `header` will be the name you want rendered in the Table Header
  //   header: 'budgetVersionID',
  // },
  {
    // `key` is the name of the field on the row object itself for the header
    key: 'code',

    // `header` will be the name you want rendered in the Table Header
    header: 'Code',
  },

  {
    key: 'description',
    header: 'Name',
  },
  {
    key: 'comments',
    header: 'Description',
  },
  {
    key: 'fiscalYearID',

    header: 'Fiscal year'
  }
  ,
  {
    key: 'budgetVersionTypeID',

    header: 'Budget version type'
  },
  {
    key: 'calculationStatus',

    header: 'Status'
  },
  {
    key: 'updateddate',
    
    header: 'Updated date'
  },
  {
    key: 'UserProfile',

    header: 'User'
  }
  ,
  {
    key: 'overflow',

    header: ''
  }
];


export default headers;