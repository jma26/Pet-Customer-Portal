import { Form } from 'react-router';

export default function SignOutButton() {
  return (
    <Form method="post" action="/api/signout" className="flex">
      <input type="hidden" name="intent" value="signout" />
      <button type="submit" className="cursor-pointer flex-1 text-left">Sign Out</button>
    </Form>
  )
}