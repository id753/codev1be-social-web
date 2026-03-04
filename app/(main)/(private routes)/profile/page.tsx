import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Мій профіль'
}

export default async function ProfilePage() {

  return (
    <main className="section">
      <div className="container">
      <h1>Hello world</h1>
      </div>
    </main>
  );
}