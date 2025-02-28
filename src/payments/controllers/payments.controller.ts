import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { UpdatePaymentDto } from '../dto/update-payment-intent.dto';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('initiate')
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createPaymentIntent(createPaymentIntentDto);
  }
  @Post('verify')
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(verifyPaymentDto);
  }
}
