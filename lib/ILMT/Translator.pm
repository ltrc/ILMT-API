package ILMT::Translator;
use strict;
use warnings;
use Dir::Self;
use Data::Dumper;
use Exporter qw(import);
use Module::Pluggable::Object;

our @EXPORT_OK = qw(get_translator);

my %translator_table;

sub new_translator {
    my $class = shift;
    my $self = {
        src => shift,
        tgt => shift,
    };

    @{$self->{plugins}} = Module::Pluggable::Object->new(
        search_path => "ILMT::$self->{src}::$self->{tgt}",
        require => 1)->plugins();

    $self->{seq} = shift;

    bless $self, $class;

    # Register this module as a translator service
    $translator_table{$self->{src}}{$self->{tgt}} = $self;

    return $self;
}

sub get_translator {
    my ($src, $tgt) = @_;
    return $translator_table{$src}{$tgt};
}

sub translate {
    my ($self, %args) = @_;
    my $result = "";
    my %final_result;
    my @dispatch_seq = @{$self->{seq}};
    foreach my $index (0 .. $#dispatch_seq) {
        my $module = $dispatch_seq[$index ++];
        my $identifier = "${module}-$index";
        my $package = "ILMT::$self->{src}::$self->{tgt}::$module";
        $final_result{$identifier} = $package->can('process')->(%args);
        $args{'data'} = $final_result{$identifier};
    }
    return \%final_result;
}

1;