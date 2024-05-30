import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '~/hooks/redux'
import useQuery from '~/hooks/useQuery'
import { PaymentActions } from '~/redux/slices'
import { UpdatePayment } from '~/types/payment'

const Payment: React.FC = () => {
  const query = useQuery()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const udpatePaymentStatus = async () => {
      const queryData = {
        partnerCode: query.get('partnerCode'),
        orderId: query.get('orderId'),
        requestId: query.get('requestId'),
        amount: query.get('amount'),
        orderInfo: query.get('orderInfo'),
        orderType: query.get('orderType'),
        transId: query.get('transId'),
        responseTime: query.get('responseTime'),
        extraData: query.get('extraData'),
        signature: query.get('signature')
      }

      const data: UpdatePayment = {
        paymentId: queryData.orderId as string,
        transactionId: queryData.transId as string
      }

      const res = await dispatch(PaymentActions.updatePaymentStatus(data))
      if (res.payload?.statusCode === 200) {
        toast.success('Payment successfully')
        navigate('/')
      }
    }

    udpatePaymentStatus()
  }, [])
  return <div className='font-bold text-center text-blue-600 text-2xl'>Thank you for your order!</div>
}

export default Payment
