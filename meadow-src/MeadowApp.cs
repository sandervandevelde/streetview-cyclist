using System;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using Meadow;
using Meadow.Devices;
using Meadow.Foundation.Leds;
using Meadow.Hardware;
using Meadow.Peripherals.Leds;

namespace Project1
{
    public class MeadowApp : App<F7FeatherV2>
    {
        RgbPwmLed onboardLed;

        IDigitalInterruptPort input;

        int _cycles = 0;

        int _flankCounter = 0;

        public override Task Initialize()
        {
            onboardLed = new RgbPwmLed(
                redPwmPin: Device.Pins.OnboardLedRed,
                greenPwmPin: Device.Pins.OnboardLedGreen,
                bluePwmPin: Device.Pins.OnboardLedBlue,
                CommonType.CommonAnode);

            SetColor(Color.Yellow);

            Resolver.Log.Info("Initialize wifi...");

            var wifi = Device.NetworkAdapters.Primary<IWiFiNetworkAdapter>();

            wifi.NetworkDisconnected += (s, e) => Resolver.Log.Info("Disconnected event...");
            wifi.NetworkConnectFailed += (s) => Resolver.Log.Info("Connect failed event...");
            wifi.NetworkConnecting += (s) => Resolver.Log.Info("Connecting event...");
            wifi.NetworkError += (s, e) => Resolver.Log.Info($"Error event: {e.ErrorCode}");
            wifi.NetworkConnected += NetworkConnected;

            try
            {
                Resolver.Log.Info($"Start connecting.....");

                wifi.Connect("ssid", "password", TimeSpan.FromSeconds(60));

                SetColor(Color.Blue);
            }
            catch (Exception ex)
            {
                Resolver.Log.Info($"Connection exception: {ex.Message}");
            }

            Resolver.Log.Info("Initializing hardware...");

            //==== create an input port on D04. 
            input = Device.CreateDigitalInterruptPort(
                Device.Pins.D04,
                InterruptMode.EdgeBoth,
                ResistorMode.InternalPullDown);

            var observer = IDigitalInterruptPort.CreateObserver(
                handler: async result =>
                {
                    if (result.New.State)
                    {
                        _flankCounter++;
                        //Resolver.Log.Info($"Observer filter {_flankCounter} satisfied, time: {result.New.Time}");
                    }

                    var interval = 5;

                    var x = _flankCounter % (2* interval);

                    if (x == 0 || x == interval)
                    {
                        await Cycle();
                    }

                    if (x < interval)
                    {
                        //0- (interval-1)
                        SetColor(Color.Red);
                    }
                    else
                    {
                        //interval-((2* interval) -1)
                        SetColor(Color.Green);
                    }
                },
                filter: result =>
                {
                    // Only notify if the new event is > 100 millisecond from last time it was notified.
                    if (result.Old is { } old)
                    { // C# 8 null pattern matching for not null
                        //return (result.New.Time - old.Time) > TimeSpan.FromSeconds(1);
                        return (result.New.Time - old.Time) > TimeSpan.FromMilliseconds(100);
                    }
                    else return false;
                }

            );
            input.Subscribe(observer);

            Resolver.Log.Info("Hardware initialized.");

            return base.Initialize();
        }

        private async void NetworkConnected(INetworkAdapter sender, NetworkConnectionEventArgs args)
        {
            Resolver.Log.Info("Connecting handler...");

            SetColor(Color.Blue);
        }

        private async Task Cycle()
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    _cycles++;

                    HttpResponseMessage response =
                        await client.GetAsync($"http://192.168.0.208:7000/cycle?timestamp={_cycles}");

                    response.EnsureSuccessStatusCode();
                    string json = await response.Content.ReadAsStringAsync();

                    Resolver.Log.Info($"Cycle: {_cycles}, Timestamp: {json}");
                }
                catch (TaskCanceledException)
                {
                    Resolver.Log.Info("Request timed out.");
                }
                catch (Exception e)
                {
                    Resolver.Log.Info($"Request went sideways: {e.Message}");
                }
            }
        }

        private void SetColor(Color color)
        {
            onboardLed.SetColor(color);
        }
    }
}