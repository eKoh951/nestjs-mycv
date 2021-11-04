import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users/user.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: number;

  // Transform decorator is used to 'transform' any value
  // as the return value, here we only return the id of
  // the user object
  @Transform(({ obj }: { obj: User }) => obj.id)
  @Expose()
  userId: number;
}
