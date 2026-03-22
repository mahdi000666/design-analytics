from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from groq import Groq
from django.conf import settings

class AITestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        client = Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": "In one sentence, confirm you are working correctly."}]
        )
        return Response({"result": response.choices[0].message.content})