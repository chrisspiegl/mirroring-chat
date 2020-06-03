// https://date-fns.org/docs/formatDistance
import formatDistanceStrict from 'date-fns/formatDistanceStrict'

export default function dateFormatStrict(fromDate, toDate = new Date()) {
  return formatDistanceStrict(fromDate, toDate, { addSuffix: true })
}
