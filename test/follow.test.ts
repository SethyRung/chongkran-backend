import { Test, TestingModule } from "@nestjs/testing";
import { FollowController } from "../src/modules/follows/follow.controller";
import { FollowService } from "../src/modules/follows/follow.service";
import { FollowModule } from "../src/modules/follows/follow.module";
import { MongooseModule } from "@nestjs/mongoose";

describe("FollowController", () => {
  let controller: FollowController;
  let service: FollowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot("mongodb://localhost:27017/test"), FollowModule],
    }).compile();

    controller = module.get<FollowController>(FollowController);
    service = module.get<FollowService>(FollowService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe("follow", () => {
    it("should allow a user to follow another user", async () => {
      const followDto = { followingId: "507f1f77bcf86cd799439011" };
      const mockUser = { sub: "507f1f77bcf86cd799439012" };

      jest.spyOn(service, "follow").mockResolvedValue({
        message: "Successfully followed user",
      });

      const result = await controller.follow(mockUser as any, followDto);

      expect(service.follow).toHaveBeenCalledWith(mockUser.sub, followDto);
      expect(result).toBeDefined();
    });

    it("should throw error when trying to follow self", async () => {
      const followDto = { followingId: "507f1f77bcf86cd799439011" };
      const mockUser = { sub: "507f1f77bcf86cd799439011" };

      jest.spyOn(service, "follow").mockRejectedValue(new Error("Cannot follow yourself"));

      await expect(controller.follow(mockUser as any, followDto)).rejects.toThrow(
        "Cannot follow yourself",
      );
    });
  });

  describe("unfollow", () => {
    it("should allow a user to unfollow another user", async () => {
      const unfollowDto = { followingId: "507f1f77bcf86cd799439011" };
      const mockUser = { sub: "507f1f77bcf86cd799439012" };

      jest.spyOn(service, "unfollow").mockResolvedValue(undefined);

      const result = await controller.unfollow(mockUser as any, unfollowDto);

      expect(service.unfollow).toHaveBeenCalledWith(mockUser.sub, unfollowDto);
      expect(result).toEqual("Successfully unfollowed user");
    });
  });

  describe("getFollowers", () => {
    it("should return list of followers for a user", async () => {
      const userId = "507f1f77bcf86cd799439011";
      const mockFollowers = {
        data: [
          { id: "1", firstName: "John", lastName: "Doe", avatar: "avatar1.jpg" },
          { id: "2", firstName: "Jane", lastName: "Smith", avatar: "avatar2.jpg" },
        ],
        meta: { total: 2, limit: 10, offset: 0 },
        __paginated: true,
      };

      jest.spyOn(service, "getFollowers").mockResolvedValue(mockFollowers as any);

      const result = await controller.getFollowers(userId, { offset: 0, limit: 10 });

      expect(service.getFollowers).toHaveBeenCalledWith(userId, { offset: 0, limit: 10 });
      expect(result).toEqual(mockFollowers);
    });
  });

  describe("isFollowing", () => {
    it("should check if current user is following another user", async () => {
      const followingId = "507f1f77bcf86cd799439011";
      const mockUser = { sub: "507f1f77bcf86cd799439012" };

      jest.spyOn(service, "isFollowing").mockResolvedValue(true);

      const result = await controller.isFollowing(mockUser as any, followingId);

      expect(service.isFollowing).toHaveBeenCalledWith(mockUser.sub, followingId);
      expect(result).toEqual({ isFollowing: true });
    });
  });
});
