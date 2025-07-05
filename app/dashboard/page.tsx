'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  Users, 
  Plus,
  LogOut,
  Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCurrentLocation, LocationData } from '@/lib/geolocation';
import ContactManager from '@/components/ContactManager';
import AlertHistory from '@/components/AlertHistory';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relation: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [showContactManager, setShowContactManager] = useState(false);
  const [showAlertHistory, setShowAlertHistory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchContacts();
  }, [router]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/contacts', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyAlert = async () => {
    if (contacts.length === 0) {
      toast.error('Please add emergency contacts first');
      setShowContactManager(true);
      return;
    }

    setIsSendingAlert(true);
    toast.loading('Getting your location...', { id: 'location' });

    try {
      const location: LocationData = await getCurrentLocation();
      toast.dismiss('location');
      toast.loading('Sending emergency alert...', { id: 'alert' });

      const token = localStorage.getItem('token');
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          message: 'Emergency alert from RakshaAlert',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.dismiss('alert');
        toast.success(`Emergency alert sent to ${data.contactsNotified} contacts!`);
      } else {
        throw new Error('Failed to send alert');
      }
    } catch (error) {
      toast.dismiss();
      if (error instanceof GeolocationPositionError) {
        toast.error('Location access denied. Please enable location services.');
      } else {
        toast.error('Failed to send emergency alert. Please try again.');
      }
    } finally {
      setIsSendingAlert(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                RakshaAlert
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAlertHistory(true)}
                className="text-gray-600 hover:text-gray-800"
              >
                <Clock className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h2>
          <p className="text-gray-600">
            Stay safe with your personal emergency alert system
          </p>
        </div>

        {/* Emergency Alert Button */}
        <div className="mb-8">
          <Card className="border-red-200 shadow-lg bg-gradient-to-r from-red-500 to-pink-600">
            <CardContent className="p-8 text-center">
              <Button
                onClick={handleEmergencyAlert}
                disabled={isSendingAlert}
                className="w-full h-20 text-2xl font-bold bg-white text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:scale-105 shadow-xl"
              >
                {isSendingAlert ? (
                  <>
                    <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                    Sending Alert...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-8 h-8 mr-3" />
                    🚨 SEND SOS ALERT 🚨
                  </>
                )}
              </Button>
              <p className="text-white/90 mt-4 text-sm">
                Press this button in case of emergency to alert your contacts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Emergency Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}/5</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.phone}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Emergency Contacts</CardTitle>
                <CardDescription>
                  Add up to 5 trusted contacts who will receive your emergency alerts
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowContactManager(true)}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No emergency contacts added yet</p>
                <Button
                  onClick={() => setShowContactManager(true)}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                >
                  Add Your First Contact
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {contact.relation}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Contact Manager Modal */}
      {showContactManager && (
        <ContactManager
          isOpen={showContactManager}
          onClose={() => setShowContactManager(false)}
          onContactAdded={fetchContacts}
          contacts={contacts}
        />
      )}

      {/* Alert History Modal */}
      {showAlertHistory && (
        <AlertHistory
          isOpen={showAlertHistory}
          onClose={() => setShowAlertHistory(false)}
        />
      )}
    </div>
  );
}