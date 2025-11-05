type roleType = "accountant" | "secretary" | null;

interface ILogin {
  status: string;
  token: {
    accessToken: string;
  };
  data: {
    user: {
      _id: string;
      username: string;
      password: string;
      firstname: string;
      lastname: string;
      role: roleType;
      nationalCode: string;
    };
  };
}
