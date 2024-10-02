from django.shortcuts import render
from django.http import JsonResponse
import tempfile
from django.views.decorators.csrf import csrf_exempt
from . predict import predict_sentence_from_video


# Create your views here.
@csrf_exempt
def prediction (request) :
    if request.method == "POST" : 
        try:
            video_file = request.FILES['video']
            with tempfile.NamedTemporaryFile(suffix='.mp4') as temp_video:
                temp_video.write(video_file.read())
                temp_video.flush()  
                sentence = predict_sentence_from_video(temp_video.name)
                res = {'result' : sentence}
                return JsonResponse(res, status=200)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'result' : 'sentence'}, status=200)
