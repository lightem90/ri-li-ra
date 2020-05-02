export class FirebaseConstant {

  static entityTableNames = {
    user : "app-user",
    budget : "budget",
    work : "work",
    service : "service",
    material : "material",
    default_materials: "default_materials"
  }

  static relationTableNames = {
    userRole : "user-role",
    userBudget : "user-budget",
    userWork : "user-work",
    userService : "user-service",
    userMaterial : "user-material",
  }
  
}