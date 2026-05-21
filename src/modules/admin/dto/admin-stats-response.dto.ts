import { ApiProperty } from "@nestjs/swagger";

class RecipeSummaryDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  authorName: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  createdAt: Date;
}

class AuthorRequestSummaryDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  avatar: string;
}

class RoleCountDto {
  @ApiProperty()
  role: string;
  @ApiProperty()
  count: number;
}

class TrendPointDto {
  @ApiProperty()
  date: string;
  @ApiProperty()
  count: number;
}

class PopularRecipeDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  views: number;
  @ApiProperty()
  likes: number;
}

class ActivityItemDto {
  @ApiProperty()
  type: "user" | "recipe" | "review";
  @ApiProperty()
  description: string;
  @ApiProperty()
  timestamp: Date;
}

export class AdminStatsResponseDto {
  @ApiProperty()
  totalUsers: number;
  @ApiProperty()
  totalRecipes: number;
  @ApiProperty()
  totalPendingRecipes: number;
  @ApiProperty()
  totalPendingAuthorRequests: number;
  @ApiProperty()
  totalReviews: number;
  @ApiProperty({ type: [RecipeSummaryDto] })
  recentPendingRecipes: RecipeSummaryDto[];
  @ApiProperty({ type: [AuthorRequestSummaryDto] })
  recentPendingAuthorRequests: AuthorRequestSummaryDto[];
  @ApiProperty({ type: [RoleCountDto] })
  usersByRole: RoleCountDto[];
  @ApiProperty({ type: [TrendPointDto] })
  userTrendSeries: TrendPointDto[];
  @ApiProperty({ type: [TrendPointDto] })
  recipeTrendSeries: TrendPointDto[];
  @ApiProperty({ type: [PopularRecipeDto] })
  popularRecipes: PopularRecipeDto[];
  @ApiProperty({ type: [ActivityItemDto] })
  recentActivity: ActivityItemDto[];
}
