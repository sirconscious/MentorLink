import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from "../Layouts/DashboardLayout";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Star } from 'lucide-react';
import { useState } from 'react';

export default function RateSession({ id }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const { data, setData, post, processing, errors } = useForm({
    note: 0,
    comment: '',
    problem_resolved: '',
    demande_id: id
  });

  const submit = (e) => {
    e.preventDefault();
    post('/ratings');
  };

  const handleRatingClick = (value) => {
    setRating(value);
    setData('note', value);
  };

  return ( 
    <DashboardLayout>
      <Head title="Noter la session" />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-2xl mx-auto px-6 py-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <h1 className="text-2xl font-bold text-foreground">
              Noter la session
            </h1>
            <p className="text-muted-foreground mt-2">
              Partagez votre expérience avec le mentor
            </p>
          </div>
        </div>

        {/* Rating Form */}
        <div className="max-w-2xl mx-auto px-6 py-8">
          <form onSubmit={submit} className="bg-card rounded-lg border border-border p-6 space-y-6">
            {/* Rating Stars */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Note du mentor *
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="text-2xl focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hover || rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.note && (
                <p className="text-sm text-red-500">{errors.note}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {rating > 0 ? `Vous avez donné ${rating} étoile(s)` : 'Sélectionnez une note de 1 à 5 étoiles'}
              </p>
            </div>

            {/* Problem Resolution */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Votre problème est-il résolu ? *
              </Label>
              <RadioGroup
                value={data.problem_resolved}
                onValueChange={(value) => setData('problem_resolved', value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oui" id="oui" />
                  <Label htmlFor="oui" className="cursor-pointer">
                    Oui, complètement résolu
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partiellement" id="partiellement" />
                  <Label htmlFor="partiellement" className="cursor-pointer">
                    Partiellement résolu
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non" id="non" />
                  <Label htmlFor="non" className="cursor-pointer">
                    Non, pas résolu
                  </Label>
                </div>
              </RadioGroup>
              {errors.problem_resolved && (
                <p className="text-sm text-red-500">{errors.problem_resolved}</p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-3">
              <Label htmlFor="comment" className="text-sm font-medium">
                Commentaire (optionnel)
              </Label>
              <Textarea
                id="comment"
                value={data.comment}
                onChange={(e) => setData('comment', e.target.value)}
                placeholder="Partagez votre expérience avec le mentor... Qu'avez-vous aimé ? Des suggestions d'amélioration ?"
                className="min-h-[120px]"
              />
              {errors.comment && (
                <p className="text-sm text-red-500">{errors.comment}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={processing || !data.note || !data.problem_resolved}
              >
                {processing ? 'Envoi en cours...' : 'Soumettre l\'avis'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}