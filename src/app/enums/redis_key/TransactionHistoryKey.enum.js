function createKeyEnum(name) {
  return {
    GET: name + 'get',
  }
}

const TransactionHistoryKeyEnum = createKeyEnum('transaction_history:')

export default TransactionHistoryKeyEnum
