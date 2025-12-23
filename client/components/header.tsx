import ButtonLogout from '@/components/button-logout'
import { ModeToggle } from '@/components/toggle-theme'
import Link from 'next/link'

export default async function Header() {
  return (
    <div>
      <ul>
        <li>
          <Link href='/products'>Product List</Link>
        </li>
        <li>
          <Link href='/products/create'>Create Product</Link>
        </li>
        <li>
          <Link href='/login'>Login</Link>
        </li>
        <li>
          <Link href='/register'>Register</Link>
        </li>
        <li>
          <ButtonLogout />
        </li>
      </ul>
      <ModeToggle />
    </div>
  )
}
