import { Head, useForm, Link } from '@inertiajs/react';
import DashboardLayout from './Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function DemandeForm({ mentor, subjects }) {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        description: '',
        date_debut: '',
        type: 'online',
        mentor_id: mentor.id
    });

    const submit = (e) => {
        e.preventDefault();
        post('/demandes'); // URL directe au lieu de route()
    };

    return (
        <>
            <Head title={`Demander une session - ${mentor.name}`} />
            <DashboardLayout>
                <div className="min-h-screen bg-background">
                    {/* Header */}
                    <div className="border-b border-border bg-card">
                        <div className="max-w-2xl mx-auto px-6 py-6">
                            <Link
                                href={`/mentors/${mentor.id}`}
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Retour au profil
                            </Link>
                            <h1 className="text-2xl font-bold text-foreground">
                                Demander une session avec {mentor.name}
                            </h1>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="max-w-2xl mx-auto px-6 py-8">
                        <form onSubmit={submit} className="bg-card rounded-lg border border-border p-6 space-y-6">
                            {/* Module Selection */}
                            <div className="space-y-3">
                                <Label htmlFor="subject" className="text-sm font-medium">
                                    Module concerné *
                                </Label>
                                <select
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    className="w-full p-2 border border-border rounded-md bg-background"
                                    required
                                >
                                    <option value="">Sélectionnez un module</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.name}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.subject && (
                                    <p className="text-sm text-red-500">{errors.subject}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Description de la difficulté *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Décrivez en détail la difficulté que vous rencontrez (minimum 20 caractères)..."
                                    className="min-h-[120px]"
                                    required
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {data.description.length}/20 caractères minimum
                                </p>
                            </div>

                            {/* Date et Heure */}
                            <div className="space-y-3">
                                <Label htmlFor="date_debut" className="text-sm font-medium">
                                    Date et heure proposée *
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="datetime-local"
                                        id="date_debut"
                                        value={data.date_debut}
                                        onChange={(e) => setData('date_debut', e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                        required
                                    />
                                </div>
                                {errors.date_debut && (
                                    <p className="text-sm text-red-500">{errors.date_debut}</p>
                                )}
                            </div>

                            {/* Type de session */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Type de session *</Label>
                                <RadioGroup
                                    value={data.type}
                                    onValueChange={(value) => setData('type', value)}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="online" id="online" />
                                        <Label htmlFor="online" className="cursor-pointer">
                                            En ligne
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="presentiel" id="presentiel" />
                                        <Label htmlFor="presentiel" className="cursor-pointer">
                                            Présentiel
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {errors.type && (
                                    <p className="text-sm text-red-500">{errors.type}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={processing || data.description.length < 20}
                                >
                                    {processing ? 'Envoi en cours...' : 'Soumettre la demande'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}