import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, saveUser, generateUserId } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    if (await getUserByEmail(email)) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit faire au moins 6 caractères." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: generateUserId(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    await saveUser(newUser);

    return NextResponse.json(
      { message: "Compte créé avec succès." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Register POST] Erreur inattendue:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
