using System;
using System.Net.Http;
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
        private static int _counter = 0;
        public override Task Initialize()
        {
            Resolver.Log.Info("Initialize...");

            var wifi = Device.NetworkAdapters.Primary<IWiFiNetworkAdapter>();

            wifi.NetworkDisconnected += (s, e) => Resolver.Log.Info("Disconnected event...");
            wifi.NetworkConnectFailed += (s) => Resolver.Log.Info("Connect failed event...");
            wifi.NetworkConnecting += (s) => Resolver.Log.Info("Connecting event...");
            wifi.NetworkError += (s, e) => Resolver.Log.Info($"Error event: {e.ErrorCode}");
            wifi.NetworkConnected += NetworkConnected;

            try
            {
                Resolver.Log.Info($"Start connecting.....");

                wifi.Connect("gspot", "sinterklaas", TimeSpan.FromSeconds(60));

                Resolver.Log.Info($"Is connected.....");
            }
            catch (Exception ex)
            {
                Resolver.Log.Info($"Connection exception: {ex.Message}");
            }

            //            Resolver.Log.Info($"SSID: {wifi.DefaultSsid}");

            return base.Initialize();
        }

        private async void NetworkConnected(INetworkAdapter sender, NetworkConnectionEventArgs args)
        {
            while (true)
            {
                await Cycle();

                await Task.Delay(TimeSpan.FromMilliseconds(5000));
            }
        }

        static async Task Cycle()
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    _counter++;

                    HttpResponseMessage response =
                        await client.GetAsync($"http://192.168.0.208:7000/cycle?timestamp={_counter}");

                    response.EnsureSuccessStatusCode();
                    string json = await response.Content.ReadAsStringAsync();

                    Resolver.Log.Info($"Cycle: {_counter}, Timestamp: {json}");
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
    }

    public class GetCycle
    {
        public int timestamp { get; set; }
    }
}