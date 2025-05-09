import type {Executor} from './';
import {
    AuthController, 
    ResourcesController, 
    RoleController, 
    RoleResourcesController, 
    TaskManagerService, 
    UserController, 
    UserRoleController
} from './services/';

export class Api {
    
    readonly authController: AuthController
    
    readonly roleController: RoleController
    
    readonly userController: UserController
    
    readonly userRoleController: UserRoleController
    
    readonly resourcesController: ResourcesController
    
    readonly roleResourcesController: RoleResourcesController
    
    readonly taskManagerService: TaskManagerService
    
    constructor(executor: Executor) {
        this.authController = new AuthController(executor);
        this.roleController = new RoleController(executor);
        this.userController = new UserController(executor);
        this.userRoleController = new UserRoleController(executor);
        this.resourcesController = new ResourcesController(executor);
        this.roleResourcesController = new RoleResourcesController(executor);
        this.taskManagerService = new TaskManagerService(executor);
    }
}