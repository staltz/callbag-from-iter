import { Source } from 'callbag'

export default function fromIter<T>(iterator: Iterable<T> | Iterator<T>): Source<T>
